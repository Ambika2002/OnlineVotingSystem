namespace OnlineVotingSystem.Models
{
    public class ElectionResultDto
    {
        public int ElectionId { get; set; }
        public string ElectionName { get; set; }
        public int CandidateId { get; set; }
        public string CandidateName { get; set; }
        public string CandidateParty { get; set; }
        public int TotalVotes { get; set; }
    }

}
