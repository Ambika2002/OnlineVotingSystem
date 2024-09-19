using OnlineVotingSystem.Models;
using System.ComponentModel.DataAnnotations;

namespace OnlineVotingSystem.ElectionRepository
{
    public interface IElectionOpt
    {
       
        Task<IEnumerable<Elections>> GetAllElectionsAsync();
        Task<Elections> GetCurrentElectionAsync();
        Task<Elections> GetElectionbyIDAsync(int e_id);
     
    }
}
