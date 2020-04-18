using System.ComponentModel.DataAnnotations;

namespace CardGame.Models
{
    public sealed class GameFieldState
    {
        [Required]
        [MinLength(1)]
        public GameCard[] Cards { get; set; }
    }
}
