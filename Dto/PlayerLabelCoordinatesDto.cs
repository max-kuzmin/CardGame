using System.ComponentModel.DataAnnotations;

namespace CardGame.Dto
{
    public sealed class PlayerLabelCoordinatesDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public int X { get; set; }

        [Required]
        public int Y { get; set; }
    }
}
