using System;
using System.Collections.Generic;
using System.Linq;
using CardGame.Models;
using Microsoft.Extensions.Caching.Memory;

namespace CardGame.Services
{
    internal sealed class GameFieldService : IGameFieldService
    {
        private readonly Random _random = new Random((int) DateTime.UtcNow.Ticks);
        private readonly IMemoryCache _memoryCache;
        private readonly GameFieldHub _gameFieldHub;

        public GameFieldService(
            IMemoryCache memoryCache,
            GameFieldHub gameFieldHub)
        {
            _memoryCache = memoryCache;
            _gameFieldHub = gameFieldHub;
        }

        public GameFieldState Get()
        {
            lock (Constants.GameFieldStateKey)
            {
                if (!_memoryCache.TryGetValue(Constants.GameFieldStateKey, out GameFieldState state))
                {
                    Create();
                    MixThrownCards();
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
                var original = Get();

                foreach (var card in updatedCards)
                {
                    var toUpdate = original.Cards.Single(e => e.Id == card.Id);
                    toUpdate.IsOpened = card.IsOpened;
                    toUpdate.IsThrown = card.IsThrown;
                    toUpdate.Order = card.Order;
                    toUpdate.OwnerId = card.OwnerId;
                    toUpdate.X = card.X;
                    toUpdate.Y = card.Y;
                }

                _memoryCache.Set(Constants.GameFieldStateKey, original);
            }

            _ = _gameFieldHub.SendMessage(state);
        }

        public void MixThrownCards()
        {
            lock (Constants.GameFieldStateKey)
            {
                var state = Get();
                var cards = state.Cards.Where(e => e.IsThrown).ToList();
                var numberOfCards = cards.Count;

                for (int i = 0; i < numberOfCards; i++)
                {
                    var card = cards[_random.Next(cards.Count - 1)];
                    cards.Remove(card);

                    card.Order = i;
                    card.IsThrown = false;
                    card.IsOpened = false;
                    card.OwnerId = null;
                    card.X = 0;
                    card.Y = 0;
                }

                _memoryCache.Set(Constants.GameFieldStateKey, state);
            }
        }

        private void Create()
        {
            var cards = new List<Card>();

            for (int i = 0; i < Constants.NumberOfCards; i++)
            {
                cards.Add(new Card
                {
                    Id = i,
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
