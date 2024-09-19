namespace OnlineVotingSystem.Models
{
    public class VoterRequest
    {
        public string VoterId {  get; set; }    
        public string Email { get; set; }

        public string PasswordHash { get; set; }    
    }

    public class VoterLoginRequest
    {
        public string VoterId { get; set; }
        public string PasswordHash { get; set; } 
    }

    public class VoteRequest
    {
        public string VoterId { get; set; }
        public int electionid { get; set; }
        public int candidateid { get; set; }
    }

    public class LoginResponse
    {
        public string Message { get; set; }
        public Voters Voter { get; set; }
    }

}
