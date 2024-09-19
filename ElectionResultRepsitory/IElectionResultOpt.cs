using OnlineVotingSystem.Models;

namespace OnlineVotingSystem.ElectionResultRepsitory
{
    public interface IElectionResultOpt
    {
        Task<ElectionResult> GetElectionResultbyIDAsync(int er_id);
        Task<IEnumerable<ElectionResultDto>> GetElectionResultsAsync();
        Task<IEnumerable<CandidateResult>> GetElectionResultsAsync(int electionId);
        Task<IEnumerable<CandidateResult>> GetResultAsync(int er_id);
      
        Task<CandidateResult> GetWinnerAsync(int electionId);
        Task<IEnumerable<CandidateResult>> GetWinnerMethod1Async(int electionId);


    }
}
