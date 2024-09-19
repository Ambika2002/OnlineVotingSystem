using Dapper;
using Npgsql;
using OnlineVotingSystem.Models;
using System.Security.AccessControl;
using System.Xml.Linq;
using static System.Collections.Specialized.BitVector32;

namespace OnlineVotingSystem.ElectionRepository
{
    public class ElectionOpt:IElectionOpt
    {
        NpgsqlConnection _conn;
        string str;
        IConfiguration _config;
        public ElectionOpt(IConfiguration config)
        {
            _config = config;
            str = _config.GetConnectionString("VoteSystemConnStr");
            _conn = new NpgsqlConnection(str);
        }

        public async Task<IEnumerable<Elections>> GetAllElectionsAsync()
        {
            try
            {
                await _conn.OpenAsync();
                var result = await _conn.QueryAsync<Elections>("Select * from elections");
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
      
        public async Task<Elections> GetCurrentElectionAsync()
        {
            try
            {
                await _conn.OpenAsync();
                var result = await _conn.QueryFirstOrDefaultAsync<Elections>("Select * from elections where StartDate <= NOW() AND EndDate >= NOW()");
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
        public async Task<Elections> GetElectionbyIDAsync(int e_id)
        {
            try
            {
                await _conn.OpenAsync();
                var parameters = new { id = e_id };
                return await _conn.QueryFirstOrDefaultAsync<Elections>("Select * from elections where e_id=@id", parameters);

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


