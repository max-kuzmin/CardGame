namespace CardGame.Models
{
    public sealed class GameCard
    {
        public int Id { get; set; }

        public int X { get; set; }

        public int Y { get; set; }

        public int Rotation { get; set; }

        public bool IsOpened { get; set; }

        public string Owner { get; set; }

        public bool IsThrown { get; set; }

        public int Order { get; set; }
    }
}
