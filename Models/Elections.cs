namespace OnlineVotingSystem.Models
{
    public class Elections
    {
        public int E_Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
