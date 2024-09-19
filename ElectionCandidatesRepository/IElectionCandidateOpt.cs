using OnlineVotingSystem.Models;

namespace OnlineVotingSystem.ElectionCandidatesRepository
{
    public interface IElectionCandidateOpt
    {
        Task<IEnumerable<ElectionCandidates>> GetAllECAsync();
        Task<bool> AddCandidateToElection(int electionId, int candidateId);
    }
}
