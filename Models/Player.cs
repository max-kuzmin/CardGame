namespace CardGame.Models
{
    public sealed class Player
    {
        public Coords Label { get; set; }

        public ZoneParams PersonalZone { get; set; }

        public string Name { get; set; }
    }
}