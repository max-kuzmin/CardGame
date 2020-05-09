namespace CardGame.Models
{
    internal static class Constants
    {
        public const string GameFieldStateKey = "GameFieldState";
        public const int NumberOfCards = 108;
        public const string SendStateHubMethod = "ReceiveState";
        public readonly static Coords InitCardsCoords = new Coords { X = 170, Y = 35 };
        public readonly static Coords InitPlayerLabelCoords = new Coords { X = 300, Y = 300 };
        public readonly static ZoneParams InitPersonalZoneParams = new ZoneParams { X = 280, Y = 10, Width = 800, Height = 125 };
    }
}
