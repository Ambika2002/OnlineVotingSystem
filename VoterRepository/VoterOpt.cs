using Dapper;
using Npgsql;
using OnlineVotingSystem.Models;
using static System.Collections.Specialized.BitVector32;

namespace OnlineVotingSystem.VoterRepository
{
    public class VoterOpt : IVoterOpt
    {
        NpgsqlConnection _conn;
        string str;
        IConfiguration _config;
        public VoterOpt(IConfiguration config)
        {
            _config = config;
            str = _config.GetConnectionString("VoteSystemConnStr");
            _conn = new NpgsqlConnection(str);
        }

        public async Task<IEnumerable<Voters>>GetAllVoterAsync()
        {
            try
            {
                await _conn.OpenAsync();
               var result= await _conn.QueryAsync<Voters>("Select * from voters");
                return result.Select(row => new Voters
                {
                    Id = row.Id,
                    VotId = row.VotId, 
                    Name = row.Name,
                    Email = row.Email,
                    PasswordHash = row.PasswordHash,
                    HasVoted = row.HasVoted
                });

            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
            finally
            {
               await _conn.CloseAsync();
            }
        }

        public async Task<Voters> GetVoterByIdAsync(int systemid)
        {
            try
            {
                await _conn.OpenAsync();
                var parameters = new { id = systemid };
                return await _conn.QueryFirstOrDefaultAsync<Voters>("Select * from voters where id=@id",parameters);

            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
            finally
            {
                await _conn.CloseAsync();
            }
        }

        public async Task<Voters> GetVoterByVotIdAsync(string votid)
        {
            try
            {
                await _conn.OpenAsync();
                var parameters = new { id = votid };

     
                string query = "SELECT * FROM voters WHERE votid = @id";

              
                return await _conn.QueryFirstOrDefaultAsync<Voters>(query, parameters);
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


        public async Task<Voters> GetVoterByEmailIdAsync(string email)
        {
            try
            {
                await _conn.OpenAsync();
                var parameters = new { emailid = email };
                return await _conn.QueryFirstOrDefaultAsync<Voters>("Select * from voters where email=@emailid", parameters);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
            finally
            {
                _conn.CloseAsync();
            }
            
        }
        public async Task<bool> AddVoterAsync(Voters voter)
        {
            try
            {
                await _conn.OpenAsync();
                int result = await _conn.ExecuteAsync("AddVoter", new { vid=voter.VotId ,vname=voter.Name,vemail=voter.Email,vpwd=voter.PasswordHash,vstatus=voter.HasVoted},
                    commandType: System.Data.CommandType.StoredProcedure);
                return result <0;

            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
            finally
            {
                await _conn.CloseAsync();
            }
        }
        public async Task<bool> HasVotedAsync(string voterId)
        {
            try
            {
                await _conn.OpenAsync();
                var parameters = new { id = voterId };
                var result = await _conn.QueryFirstOrDefaultAsync<bool>("SELECT hasvoted FROM voters WHERE votid = @id", parameters);
                return result;
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

        public async Task<bool> MarkVoterAsVotedAsync(string voterId)
        {

            try
            {
                await _conn.OpenAsync();
                int result = await _conn.ExecuteAsync("MarkVoterasVoted", new { p_voterid = voterId },
                    commandType: System.Data.CommandType.StoredProcedure);
                return result < 0;

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

        public async Task<bool> CastVoteAsync(int electionid, int cand_id)
        {
            try
            {
                await _conn.OpenAsync();
                int result = await _conn.ExecuteAsync("CastVote", new { p_electionid = electionid, p_candidateid = cand_id },
                    commandType: System.Data.CommandType.StoredProcedure);
                return result < 0;

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

        public async Task<List<Elections>> GetOngoingElectionsAsync()
        {
            try
            {
                await _conn.OpenAsync();

               
                var query = "SELECT * FROM elections WHERE StartDate <= NOW() AND EndDate >= NOW()";

                var elections = await _conn.QueryAsync<Elections>(query);

                return elections.ToList();
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




        public async Task<List<Candidates>> GetCandidatesForElectionAsync(int electionId)
        {
            try
            {
                await _conn.OpenAsync();

              
                var query = @"SELECT c.* 
                      FROM candidates c 
                      INNER JOIN electioncandidates ec ON ec.candidateid = c.candidate_id
                      WHERE ec.electionid = @ElectionId";

                var candidates = await _conn.QueryAsync<Candidates>(query, new { ElectionId = electionId });
                return candidates.ToList();
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


