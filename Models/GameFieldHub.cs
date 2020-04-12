using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace CardGame.Models
{
    internal sealed class GameFieldHub: Hub
    {
        public async Task SendMessage(GameFieldState message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
