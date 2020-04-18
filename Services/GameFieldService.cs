using System;
using System.Collections.Generic;
using System.Linq;
using CardGame.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;

namespace CardGame.Services
{
    internal sealed class GameFieldService: Hub, IGameFieldService
    {
        private readonly Random _random = new Random((int) DateTime.UtcNow.Ticks);
        private readonly IMemoryCache _memoryCache;
        private readonly IHubContext<GameFieldService> _hubContext;

        public GameFieldService(
            IMemoryCache memoryCache,
            IHubContext<GameFieldService> hubContext)
        {
            _memoryCache = memoryCache;
            _hubContext = hubContext;
        }

        public GameFieldState Get()
        {
            lock (Constants.GameFieldStateKey)
            {
                if (!_memoryCache.TryGetValue(Constants.GameFieldStateKey, out GameFieldState state))
                {
                    Create();
                    Mix(false);
                    state = _memoryCache.Get(Constants.GameFieldStateKey) as GameFieldState;
                }

                return state;
            }
        }

        public void Update(GameFieldState state)
        {
            var updatedCards = state?.Cards?
                .Where(e => e.Id >= 0 && e.Id <= Constants.NumberOfCards)
                .ToArray();

            if (updatedCards?.Any() != true)
            {
                return;
            }

            lock (Constants.GameFieldStateKey)
            {
                var updated = Get();

                foreach (var card in updatedCards)
                {
                    var toUpdate = updated.Cards.Single(e => e.Id == card.Id);
                    toUpdate.IsOpened = card.IsOpened;
                    toUpdate.IsThrown = card.IsThrown;
                    toUpdate.Order = card.Order;
                    toUpdate.OwnerId = card.OwnerId;
                    toUpdate.X = card.X;
                    toUpdate.Y = card.Y;
                }

                _memoryCache.Set(Constants.GameFieldStateKey, updated);
                _hubContext.Clients.All.SendCoreAsync(Constants.SendStateHubMethod, new object[]{ updated });
            }
        }

        public void Mix(bool thrownOnly)
        {
            lock (Constants.GameFieldStateKey)
            {
                var state = Get();
                var cards = state.Cards.Where(e => !thrownOnly || e.IsThrown).ToList();
                var numberOfCards = cards.Count;

                for (int i = 0; i < numberOfCards; i++)
                {
                    var card = cards[_random.Next(cards.Count - 1)];
                    cards.Remove(card);

                    card.Order = i;
                    card.IsThrown = false;
                    card.IsOpened = false;
                    card.OwnerId = null;
                    card.X = _random.Next(100, 500);
                    card.Y = _random.Next(100, 500);
                }

                _memoryCache.Set(Constants.GameFieldStateKey, state);
                _hubContext.Clients.All.SendCoreAsync(Constants.SendStateHubMethod, new object[]{ state });
            }
        }

        private void Create()
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
                Cards = cards.ToArray()
            };

            _memoryCache.Set(Constants.GameFieldStateKey, state);
        }
    }
}
