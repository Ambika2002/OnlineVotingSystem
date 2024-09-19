namespace OnlineVotingSystem.Models
{
    public class CandidateResult
    {
        public int candidate_id { get; set; } 
        public string Name { get; set; }
        public string Party { get; set; }

        public int TotalVotes { get; set; } 
        public double VotePercentage { get; set; } 
    }
}
