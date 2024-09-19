using OnlineVotingSystem.Models;
using System.Globalization;

namespace OnlineVotingSystem.CandidateRepository
{
    public interface ICandidateOpt
    {
        Task<IEnumerable<Candidates>> GetAllCandidatesAsync();
        Task<Candidates> GetCandidateByIdAsync(int cid);

    }
}
