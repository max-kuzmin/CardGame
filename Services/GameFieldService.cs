using System;
using System.Collections.Generic;
using System.Linq;
using CardGame.Dto;
using CardGame.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;

namespace CardGame.Services
{
    internal sealed class GameFieldService : Hub, IGameFieldService
    {
        private readonly Random _random = new Random((int)DateTime.UtcNow.Ticks);
        private readonly IMemoryCache _memoryCache;
        private readonly IHubContext<GameFieldService> _hubContext;

        public GameFieldService(
            IMemoryCache memoryCache,
            IHubContext<GameFieldService> hubContext)
        {
            _memoryCache = memoryCache;
            _hubContext = hubContext;
        }

        public GameFieldState GetState()
        {
            lock (Constants.GameFieldStateKey)
            {
                if (!_memoryCache.TryGetValue(Constants.GameFieldStateKey, out GameFieldState state))
                {
                    CreateState();
                    MixCards(false);
                    state = _memoryCache.Get(Constants.GameFieldStateKey) as GameFieldState;
                }

                return state;
            }
        }

        public void MixCards(bool thrownOnly)
        {
            lock (Constants.GameFieldStateKey)
            {
                var updated = GetState();
                var cardsToMix = updated.Cards
                    .Where(e => !thrownOnly || e.IsThrown)
                    .ToList();
                var mixCount = cardsToMix.Count;

                // Pop other cards
                var otherCards = updated.Cards
                    .Except(cardsToMix)
                    .OrderBy(e => e.Order)
                    .ToArray();
                for (int i = 0; i < otherCards.Length; i++)
                {
                    otherCards[i].Order = mixCount + i + 1;
                }

                // Mix selected cards
                for (int i = 0; i < mixCount; i++)
                {
                    var card = cardsToMix[_random.Next(cardsToMix.Count - 1)];
                    cardsToMix.Remove(card);

                    card.Order = i + 1;
                    card.IsThrown = false;
                    card.IsOpened = false;
                    card.Owner = null;
                    card.X = Constants.InitCardsCoords.X;
                    card.Y = Constants.InitCardsCoords.Y;
                    card.Rotation = 0;
                }

                _memoryCache.Set(Constants.GameFieldStateKey, updated);
                _hubContext.Clients.All.SendCoreAsync(Constants.SendStateHubMethod, new object[] { updated });
            }
        }

        public void PopCard(int id)
        {
            lock (Constants.GameFieldStateKey)
            {
                var updated = GetState();
                var topCard = updated.Cards.SingleOrDefault(e => e.Id == id);

                if (topCard == null)
                {
                    return;
                }

                var cardsBefore = updated.Cards.Where(e => e.Order > topCard.Order).ToArray();
                foreach (var card in cardsBefore)
                {
                    card.Order--;
                }

                topCard.Order = Constants.NumberOfCards;

                _memoryCache.Set(Constants.GameFieldStateKey, updated);

                var stateToSend = new object[]
                {
                    new GameFieldState { Cards = cardsBefore.Append(topCard).ToArray() }
                };
                _hubContext.Clients.All.SendCoreAsync(Constants.SendStateHubMethod, stateToSend);
            }
        }

        public void SetCardRotation(CardParamDto<int> model)
        {
            UpdateCardProperties(model.Id, card => card.Rotation = model.Value % 360);
        }

        public void SetCardCoordinates(CardCoordinatesDto model)
        {
            UpdateCardProperties(model.Id, card =>
            {
                card.X = model.X;
                card.Y = model.Y;
            });
        }

        public void SetCardOwner(CardParamDto<string> model)
        {
            UpdateCardProperties(model.Id, card => card.Owner = model.Value);
        }

        public void SetCardIsOpened(CardParamDto<bool> model)
        {
            UpdateCardProperties(model.Id, card => card.IsOpened = model.Value);
        }

        public void SetCardIsThrown(CardParamDto<bool> model)
        {
            UpdateCardProperties(model.Id, card => card.IsThrown = model.Value);
        }

        public void AddPlayer(string name)
        {
            lock (Constants.GameFieldStateKey)
            {
                var updated = GetState();

                var player = updated.Players.SingleOrDefault(e => e.Name == name);
                if (player == null)
                {
                    player = new Player
                    {
                        Name = name,
                        Label = new Coords
                        {
                            X = Constants.InitPlayerLabelCoords.X,
                            Y = Constants.InitPlayerLabelCoords.Y
                            },
                        PersonalZone = new ZoneParams
                        {
                            Height = Constants.InitPersonalZoneParams.Height,
                            Width = Constants.InitPersonalZoneParams.Width,
                            Y = Constants.InitPersonalZoneParams.Y,
                            X = Constants.InitPersonalZoneParams.X
                        }
                    };
                    updated.Players = updated.Players.Append(player).ToArray();

                    _memoryCache.Set(Constants.GameFieldStateKey, updated);
                }

                var stateToSend = new object[]
                {
                    new GameFieldState { Players = new[] { player } }
                };
                _hubContext.Clients.All.SendCoreAsync(Constants.SendStateHubMethod, stateToSend);
            }
        }

        public void SetPlayerLabelCoordinates(PlayerLabelCoordinatesDto coords)
        {
            UpdatePlayerProperties(coords.Name, player =>
            {
                player.Label.X = coords.X;
                player.Label.Y = coords.Y;
            });
        }

        public void SetPersonalZoneParams(PersonalZoneParamsDto model)
        {
            UpdatePlayerProperties(model.Name, player =>
            {
                player.PersonalZone.X = model.X;
                player.PersonalZone.Y = model.Y;
                player.PersonalZone.Width = model.Width;
                player.PersonalZone.Height = model.Height;
            });
        }

        private void UpdateCardProperties(int id, Action<GameCard> action)
        {
            lock (Constants.GameFieldStateKey)
            {
                var updated = GetState();
                var card = updated.Cards.SingleOrDefault(e => e.Id == id);

                if (card == null)
                {
                    return;
                }

                action(card);

                _memoryCache.Set(Constants.GameFieldStateKey, updated);

                var stateToSend = new object[]
                {
                    new GameFieldState { Cards = new[] { card } }
                };
                _hubContext.Clients.All.SendCoreAsync(Constants.SendStateHubMethod, stateToSend);
            }
        }

        private void UpdatePlayerProperties(string name, Action<Player> action)
        {
            lock (Constants.GameFieldStateKey)
            {
                var updated = GetState();
                var player = updated.Players.SingleOrDefault(e => e.Name == name);

                if (player == null)
                {
                    return;
                }

                action(player);

                _memoryCache.Set(Constants.GameFieldStateKey, updated);

                var stateToSend = new object[]
                {
                    new GameFieldState { Players = new[] { player } }
                };
                _hubContext.Clients.All.SendCoreAsync(Constants.SendStateHubMethod, stateToSend);
            }
        }

        private void CreateState()
        {
            var cards = new List<GameCard>();

            for (int i = 0; i < Constants.NumberOfCards; i++)
            {
                cards.Add(new GameCard
                {
                    Id = i,
                    IsThrown = true,
                });
            }

            var state = new GameFieldState
            {
                Cards = cards.ToArray(),
                Players = Array.Empty<Player>()
            };

            _memoryCache.Set(Constants.GameFieldStateKey, state);
        }
    }
}
