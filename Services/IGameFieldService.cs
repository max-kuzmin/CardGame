using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
