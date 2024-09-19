using Dapper;
using Npgsql;
using OnlineVotingSystem.Models;

namespace OnlineVotingSystem.ElectionCandidatesRepository
{
    public class ElectionCandidatesOpt:IElectionCandidateOpt
    {
        NpgsqlConnection _conn;
        string str;
        IConfiguration _config;
        public ElectionCandidatesOpt(IConfiguration config)
        {
            _config = config;
            str = _config.GetConnectionString("VoteSystemConnStr");
            _conn = new NpgsqlConnection(str);
        }

        public async Task<IEnumerable<ElectionCandidates>> GetAllECAsync()
        {
            try
            {
                await _conn.OpenAsync();
                var result = await _conn.QueryAsync<ElectionCandidates>("Select * from electioncandidates");
                return result;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
            finally
            {
                await _conn.CloseAsync();
            }
        }

        public async Task<bool> AddCandidateToElection(int electionId, int candidateId)
        {
            try
            {
                using (_conn)
                {
                    await _conn.OpenAsync();
                    int result = await _conn.ExecuteAsync("addCandidatetoelection", new { p_electionid = electionId, p_candidateid = candidateId },
                    commandType: System.Data.CommandType.StoredProcedure);
                    return result < 0;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
            finally
            {

                await _conn.CloseAsync();
            }
        }

    }
}
