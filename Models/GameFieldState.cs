using System;

namespace CardGame.Models
{
    public sealed class GameFieldState
    {
        public GameCard[] Cards { get; set; } = Array.Empty<GameCard>();

        public Player[] Players { get; set; } = Array.Empty<Player>();
    }
}
