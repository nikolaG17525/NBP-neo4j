namespace Neo4jTest.Models
{
    public class Game
    {
        public string Host { get; set; }
        public string Guest { get; set; }
        public int HostGoals { get; set; }
        public int GuestGoals { get; set; }
        public int Round { get; set; }
    }
}
