using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CardGame.Models
{
    public sealed class Card
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public int X { get; set; }

        [Required]
        public int Y {get; set; }

        [Required]
        public bool IsOpened { get; set; }

        public int? OwnerId { get; set; }

        [Required]
        public bool IsThrown { get; set; }

        public int Order { get; set; }
    }
}
