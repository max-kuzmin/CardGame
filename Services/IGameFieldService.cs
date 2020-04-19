using CardGame.Dto;
using CardGame.Models;

namespace CardGame.Services
{
    public interface IGameFieldService
    {
        GameFieldState GetState();

        void MixCards(bool thrownOnly);

        void PopCard(int id);

        void SetCardRotation(CardParamDto<int> model);

        void SetCardCoordinates(CardCoordinatesDto model);

        void SetCardOwner(CardParamDto<string> model);

        void SetCardIsOpened(CardParamDto<bool> model);

        void SetCardIsThrown(CardParamDto<bool> model);
    }
}
