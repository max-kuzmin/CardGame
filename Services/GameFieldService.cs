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
                var state = GetState();
                var cardsToMix = state.Cards
                    .Where(e => !thrownOnly || e.IsThrown)
                    .ToList();
                var mixCount = cardsToMix.Count;

                // Pop other cards
                var otherCards = state.Cards
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
                    card.X = Constants.InitCardsX;
                    card.Y = Constants.InitCardsY;
                    card.Rotation = 0;
                }

                UpdateStateAndSend(state);
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

                var cardsBefore = updated.Cards.Where(e => e.Order > topCard.Order);
                foreach (var card in cardsBefore)
                {
                    card.Order--;
                }

                topCard.Order = Constants.NumberOfCards;

                UpdateStateAndSend(updated);
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

        public void AddPlayerLabel(string name)
        {
            lock (Constants.GameFieldStateKey)
            {
                var updated = GetState();

                if (updated.PlayerLabels.Any(e => e.Name == name))
                {
                    return;
                }

                updated.PlayerLabels.Add(new PlayerLabel
                {
                    Name = name,
                    X = Constants.InitPlayerLabelX,
                    Y = Constants.InitPlayerLabelY
                });

                UpdateStateAndSend(updated);
            }
        }

        public void SetPlayerLabelCoordinates(PlayerLabelCoordinatesDto coords)
        {
            lock (Constants.GameFieldStateKey)
            {
                var updated = GetState();

                var label = updated.PlayerLabels.SingleOrDefault(e => e.Name == coords.Name);
                if (label == null)
                {
                    return;
                }

                label.X = coords.X;
                label.Y = coords.Y;

                UpdateStateAndSend(updated);
            }
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

                UpdateStateAndSend(updated);
            }
        }

        private void UpdateStateAndSend(GameFieldState updated)
        {
            _memoryCache.Set(Constants.GameFieldStateKey, updated);
            _hubContext.Clients.All.SendCoreAsync(Constants.SendStateHubMethod, new object[] { updated });
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
                PlayerLabels = new List<PlayerLabel>()
            };

            _memoryCache.Set(Constants.GameFieldStateKey, state);
        }
    }
}
