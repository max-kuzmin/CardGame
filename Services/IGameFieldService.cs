using CardGame.Models;

namespace CardGame.Services
{
    public interface IGameFieldService
    {
        GameFieldState Get();

        void Update(GameFieldState state);

        void MixCards(bool thrownOnly);

        void PopCard(int id);
    }
}
