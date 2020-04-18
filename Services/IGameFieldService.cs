using CardGame.Models;

namespace CardGame.Services
{
    public interface IGameFieldService
    {
        GameFieldState Get();

        void Update(GameFieldState state);

        void Mix(bool thrownOnly);
    }
}
