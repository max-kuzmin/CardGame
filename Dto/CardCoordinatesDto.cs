using System.ComponentModel.DataAnnotations;

namespace CardGame.Dto
{
    public sealed class CardCoordinatesDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public int X { get; set; }

        [Required]
        public int Y { get; set; }
    }
}
