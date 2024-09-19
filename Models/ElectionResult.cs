namespace OnlineVotingSystem.Models
{
    public class ElectionResult
    {
        public int Id { get; set; }
        public int ElectionId { get; set; }
        public int CandidateId { get; set; }
        public int TotalVotes { get; set; }

        public Elections Elections { get; set; }
        public Candidates Candidates { get; set; }  
    }
}
