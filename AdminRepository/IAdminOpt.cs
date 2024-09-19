using OnlineVotingSystem.Models;

namespace OnlineVotingSystem.AdminRepository
{
    public interface IAdminOpt
    {
        Task<Admins> GetAdminByUsernameAsync(string username);

        //CRUD on Candidates
        Task<IEnumerable<Candidates>> GetAllCandidatesAsync();
        Task<Candidates> GetCandidateByIdAsync(int cid);
        Task<bool> AddCandidateAsync(string cname,string cparty);
        Task<bool> UpdateCandidateAsync(int cid, string party);
        Task<bool> RemoveCandidateAsync(int cid);

        //CRUD on Voters
        Task<IEnumerable<Voters>> GetAllVoterAsync();
        Task<Voters> GetVoterByIdAsync(int voterid);

        Task<Voters> GetVoterByVotIdAsync(string votid);
        Task<Voters> GetVoterByEmailIdAsync(string email);
        Task<bool> AddVoterAsync(Voters voter);
        Task<bool> UpdateVoterAsync(int id, string emailid);
        Task<bool> RemoveVoterAsync(int voterid);


        //CRUD on Elections

        Task<IEnumerable<Elections>> GetAllElectionsAsync();
        Task<Elections> GetCurrentElectionAsync();
        Task<Elections> GetElectionbyIDAsync(int e_id);
        Task<bool> AddElectionAsync(Elections election);
        Task<bool> UpdateElectionDetailAsync(int e_id, string e_name, string e_decsr);
        Task<bool> UpdateElectionPeriodAsync(int e_id, DateTime commence, DateTime stop);
        Task<bool> RemoveElectionAsync(int e_id);

        Task<IEnumerable<ElectionCandidateDTO>> GetAllElectionCandidatesAsync();
        Task<string> AddCandidateToElection(int electionId, int candidateId);
        Task<bool> DeleteCandidatefromElection(int electionId, int candidateId);

    }

}
