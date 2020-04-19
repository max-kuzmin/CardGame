using System.ComponentModel.DataAnnotations;
using CardGame.Models;
using CardGame.Services;
using Microsoft.AspNetCore.Mvc;

namespace CardGame.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameFieldController : ControllerBase
    {
        private readonly IGameFieldService _gameFieldService;

        public GameFieldController(IGameFieldService gameFieldService)
        {
            _gameFieldService = gameFieldService;
        }

        [HttpPost]
        public IActionResult Post([Required]GameFieldState state)
        {
            _gameFieldService.Update(state);
            return Ok();
        }

        [HttpGet]
        public IActionResult Get()
        {
            var result = _gameFieldService.Get();
            return Ok(result);
        }

        [HttpGet(nameof(MixCards))]
        public IActionResult MixCards(bool thrownOnly)
        {
            _gameFieldService.MixCards(thrownOnly);
            return Ok();
        }

        [HttpPost(nameof(PopCard))]
        public IActionResult PopCard([Required][FromBody]int id)
        {
            _gameFieldService.PopCard(id);
            return Ok();
        }
    }
}
