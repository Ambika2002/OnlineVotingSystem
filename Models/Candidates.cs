namespace OnlineVotingSystem.Models
{
    public class Candidates
    {
        public int candidate_id { get; set; }
        public string Name { get; set; }
        public string Party { get; set; }
        public int TotalVotes { get; set; }
    }
}
