using System.ComponentModel.DataAnnotations;

namespace CardGame.Models
{
    public sealed class GameFieldState
    {
        public GameCard[] Cards { get; set; }
    }
}
