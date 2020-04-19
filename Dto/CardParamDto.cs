using System.ComponentModel.DataAnnotations;

namespace CardGame.Dto
{
    public sealed class CardParamDto<T>
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public T Value { get; set; }
    }
}
