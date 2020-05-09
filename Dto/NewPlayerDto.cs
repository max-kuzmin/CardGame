using System.ComponentModel.DataAnnotations;

namespace CardGame.Dto
{
    public sealed class NewPlayerDto
    {
        [Required]
        public string Name { get; set; }
    }
}
