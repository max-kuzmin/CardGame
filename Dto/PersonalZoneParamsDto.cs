using System.ComponentModel.DataAnnotations;

namespace CardGame.Dto
{
    public sealed class PersonalZoneParamsDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public int X { get; set; }

        [Required]
        public int Y { get; set; }

        [Required]
        public int Width { get; set; }

        [Required]
        public int Height { get; set; }
    }
}
