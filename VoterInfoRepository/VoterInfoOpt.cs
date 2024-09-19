using Dapper;
using Npgsql;
using OnlineVotingSystem.Models;
using System.Security.Cryptography.X509Certificates;

namespace OnlineVotingSystem.VoterInfoRepository
{
    public class VoterInfoOpt:IVoterInfoOpt
    {

        NpgsqlConnection _conn;
        string str;
        IConfiguration _config;
        public VoterInfoOpt(IConfiguration config)
        {
            _config = config;
            str = _config.GetConnectionString("VoteSystemConnStr");
            _conn = new NpgsqlConnection(str);
        }


        public async Task<VoterInfo> GetVoterByVoterId(string voterId)
        {
            using (_conn)
            {
             
                return await _conn.QueryFirstOrDefaultAsync<VoterInfo>("Select * from voterinfo where voterid=@voterId", new {voterid=voterId});
                
            }
        }
    }
}
