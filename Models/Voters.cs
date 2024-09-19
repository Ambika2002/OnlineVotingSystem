namespace OnlineVotingSystem.Models
{
    public class Voters
    {

        public int Id { get; set; }

        public string VotId {  get; set; }    
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public bool HasVoted { get; set; }

    }
}
