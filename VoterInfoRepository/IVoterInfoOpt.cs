using OnlineVotingSystem.Models;

namespace OnlineVotingSystem.VoterInfoRepository
{
    public interface IVoterInfoOpt
    {
        Task<VoterInfo> GetVoterByVoterId(string voterId);
    }
}
