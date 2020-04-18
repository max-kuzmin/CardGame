using System.ComponentModel.DataAnnotations;

namespace CardGame.Models
{
    public sealed class GameCard
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public int X { get; set; }

        [Required]
        public int Y { get; set; }

        [Required]
        public int Rotation { get; set; }

        [Required]
        public bool IsOpened { get; set; }

        public int? OwnerId { get; set; }

        [Required]
        public bool IsThrown { get; set; }

        public int Order { get; set; }
    }
}
