using System.Collections.Generic;

namespace CardGame.Models
{
    public sealed class GameFieldState
    {
        public GameCard[] Cards { get; set; }

        public List<PlayerLabel> PlayerLabels { get; set; }
    }
}
