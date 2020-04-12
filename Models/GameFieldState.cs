using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CardGame.Models
{
    public sealed class GameFieldState
    {
        [Required]
        [MinLength(1)]
        public Card[] Cards { get; set; }
    }
}
