using System;

namespace CardGame.Models
{
    public sealed class GameFieldState
    {
        public GameCard[] Cards { get; set; } = Array.Empty<GameCard>();

        public PlayerLabel[] PlayerLabels { get; set; } = Array.Empty<PlayerLabel>();
    }
}
