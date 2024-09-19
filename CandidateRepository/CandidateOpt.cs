using Dapper;
using Npgsql;
using OnlineVotingSystem.Models;

namespace OnlineVotingSystem.CandidateRepository
{
    public class CandidateOpt:ICandidateOpt
    {
        NpgsqlConnection _conn;
        string str;
        IConfiguration _config;
        public CandidateOpt(IConfiguration config)
        {
            _config = config;
            str = _config.GetConnectionString("VoteSystemConnStr");
            _conn = new NpgsqlConnection(str);
        }

        public async Task<IEnumerable<Candidates>> GetAllCandidatesAsync()
        {
            try
            {
                await _conn.OpenAsync();
                var result = await _conn.QueryAsync<Candidates>("Select * from candidates");
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

        public async Task<Candidates> GetCandidateByIdAsync(int candid)
        {
            try
            {
                await _conn.OpenAsync();
                var parameters = new { id = candid };
                return await _conn.QueryFirstOrDefaultAsync<Candidates>("Select * from candidates where id=@id", parameters);

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
        

    }
}

