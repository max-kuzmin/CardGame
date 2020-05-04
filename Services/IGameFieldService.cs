using CardGame.Dto;
using CardGame.Models;

namespace CardGame.Services
{
    public interface IGameFieldService
    {
        GameFieldState GetState();

        void MixCards(bool thrownOnly, int? initX = null, int? initY = null);

        void PopCard(int id);

        void SetCardRotation(CardParamDto<int> model);

        void SetCardCoordinates(CardCoordinatesDto model);

        void SetCardOwner(CardParamDto<string> model);

        void SetCardIsOpened(CardParamDto<bool> model);

        void SetCardIsThrown(CardParamDto<bool> model);
    }
}
