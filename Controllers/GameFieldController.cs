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
        public IActionResult Post(GameFieldState state)
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

        [HttpGet("mix")]
        public IActionResult MixThrownCards(bool thrownOnly)
        {
            _gameFieldService.Mix(thrownOnly);
            return Ok();
        }
    }
}
