using System.ComponentModel.DataAnnotations;
using CardGame.Dto;
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

        [HttpGet(nameof(GetState))]
        public IActionResult GetState()
        {
            var result = _gameFieldService.GetState();
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

        [HttpPost(nameof(SetCardCoordinates))]
        public IActionResult SetCardCoordinates([Required][FromBody]CardCoordinatesDto model)
        {
            _gameFieldService.SetCardCoordinates(model);
            return Ok();
        }

        [HttpPost(nameof(SetCardIsOpened))]
        public IActionResult SetCardIsOpened([Required][FromBody]CardParamDto<bool> model)
        {
            _gameFieldService.SetCardIsOpened(model);
            return Ok();
        }

        [HttpPost(nameof(SetCardIsThrown))]
        public IActionResult SetCardIsThrown([Required][FromBody]CardParamDto<bool> model)
        {
            _gameFieldService.SetCardIsThrown(model);
            return Ok();
        }

        [HttpPost(nameof(SetCardOwner))]
        public IActionResult SetCardOwner([Required][FromBody]CardParamDto<string> model)
        {
            _gameFieldService.SetCardOwner(model);
            return Ok();
        }

        [HttpPost(nameof(SetCardRotation))]
        public IActionResult SetCardRotation([Required][FromBody]CardParamDto<int> model)
        {
            _gameFieldService.SetCardRotation(model);
            return Ok();
        }

        [HttpPost(nameof(AddPlayerLabel))]
        public IActionResult AddPlayerLabel([Required][FromBody]NewPlayerLabelDto model)
        {
            _gameFieldService.AddPlayerLabel(model.Name);
            return Ok();
        }

        [HttpPost(nameof(SetPlayerLabelCoordinates))]
        public IActionResult SetPlayerLabelCoordinates([Required][FromBody]PlayerLabelCoordinatesDto coords)
        {
            _gameFieldService.SetPlayerLabelCoordinates(coords);
            return Ok();
        }
    }
}
