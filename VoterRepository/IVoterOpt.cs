using OnlineVotingSystem.Models;

namespace OnlineVotingSystem.VoterRepository
{
    public interface IVoterOpt
    {
        Task<IEnumerable<Voters>> GetAllVoterAsync();
        Task<Voters> GetVoterByIdAsync(int voterid);

        Task<Voters> GetVoterByVotIdAsync(string votid);
        Task<Voters> GetVoterByEmailIdAsync(string email);
        Task<bool> AddVoterAsync(Voters voter);
       
        Task<bool> HasVotedAsync(string voterId);
        Task<bool> CastVoteAsync(int electionid, int cand_id);
        Task<bool> MarkVoterAsVotedAsync(string voterId);

        Task<List<Elections>> GetOngoingElectionsAsync();
        Task<List<Candidates>> GetCandidatesForElectionAsync(int electionId);
        Task<IEnumerable<Candidates>> GetAllCandidatesAsync();
        Task<Candidates> GetCandidateByIdAsync(int cid);

        Task<IEnumerable<Elections>> GetAllElectionsAsync();
       
        Task<Elections> GetElectionbyIDAsync(int e_id);
    }
}