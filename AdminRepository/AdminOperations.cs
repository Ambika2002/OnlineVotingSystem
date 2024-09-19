using Dapper;
using Npgsql;
using OnlineVotingSystem.Models;
using System.Data;

namespace OnlineVotingSystem.AdminRepository
{
    public class AdminOperations :IAdminOpt
    {
        NpgsqlConnection _conn;
        string str;
        IConfiguration _config;

        public IAdminOpt Object { get; }

        public AdminOperations(IConfiguration config)
        {
            _config = config;
            str = _config.GetConnectionString("VoteSystemConnStr");
            _conn = new NpgsqlConnection(str);
        }

        public AdminOperations() 
        {
            _conn = new NpgsqlConnection("Server=localhost ; Database= OnlineVotingSystem ; User Id=postgres ; Password= 12345;");
        }

   

        // Example of the repository method
        public async Task<Admins> GetAdminByUsernameAsync(string username)
        {
            // Replace with your actual database call logic to fetch admin by username
            var query = "SELECT * FROM Admins WHERE Username = @Username";
            return await _conn.QuerySingleOrDefaultAsync<Admins>(query, new { Username = username });
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
        public async Task<bool> AddElectionAsync(Elections election)
        {
            try
            {
                await _conn.OpenAsync();

                int result = await _conn.ExecuteAsync(
                    "AddElections",
                    new
                    {
                        e_name = election.Name,
                        descr = election.Description,
                        commence = election.StartDate,
                        terminate = election.EndDate
                    },
                    commandType: System.Data.CommandType.StoredProcedure
                );


                return result < 0;
            }
            catch (Exception ex)
            {

                Console.WriteLine($"Error occurred while adding election: {ex.Message}");
                return false;
            }
            finally
            {

                await _conn.CloseAsync();
            }
        }


        public async Task<bool> UpdateElectionDetailAsync(int e_id, string e_name, string e_descr)
        {
            try
            {
                await _conn.OpenAsync();
                int result = await _conn.ExecuteAsync("UpdateElectionsDetail", new { elec_id = e_id, e_name = e_name, descr = e_descr },
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
        public async Task<bool> UpdateElectionPeriodAsync(int e_id, DateTime commence, DateTime stop)
        {
            try
            {
                await _conn.OpenAsync();
                int result = await _conn.ExecuteAsync("UpdateElectionsDate", new { elect_id = e_id, commence = commence, terminate = stop },
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
        public async Task<bool> RemoveElectionAsync(int e_id)
        {
            try
            {
                await _conn.OpenAsync();
                int result = await _conn.ExecuteAsync("DeleteElections", new { ele_id = e_id },
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
        public async Task<bool> AddCandidateAsync(string c_name,string c_party)
        {
            try
            {
                await _conn.OpenAsync();
                int result = await _conn.ExecuteAsync("AddCandidate", new { cname = c_name, cparty = c_party },
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


        public async Task<bool> UpdateCandidateAsync(int c_id, string party_name)
        {
            try
            {
                await _conn.OpenAsync();
                int result = await _conn.ExecuteAsync("UpdateCandidate", new { cid = c_id, cparty = party_name },
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
        public async Task<bool> RemoveCandidateAsync(int c_id)
        {

            using (_conn)
            {
                int result = await _conn.ExecuteAsync("DeleteCandidate", new { cid = c_id },
                    commandType: System.Data.CommandType.StoredProcedure);
                return result < 0;

            }
        }

        public async Task<IEnumerable<Voters>> GetAllVoterAsync()
        {
            try
            {
                await _conn.OpenAsync();
                var result = await _conn.QueryAsync<Voters>("Select * from voters");
                return result.Select(row => new Voters
                {
                    Id = row.Id,
                    VotId = row.VotId, // Ensure these names match
                    Name = row.Name,
                    Email = row.Email,
                    PasswordHash = row.PasswordHash,
                    HasVoted = row.HasVoted
                });

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

        public async Task<Voters> GetVoterByIdAsync(int systemid)
        {
            try
            {
                await _conn.OpenAsync();
                var parameters = new { id = systemid };
                return await _conn.QueryFirstOrDefaultAsync<Voters>("Select * from voters where id=@id", parameters);

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
            catch (Exception ex)
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
                int result = await _conn.ExecuteAsync("AddVoter", new { vid = voter.VotId, vname = voter.Name, vemail = voter.Email, vpwd = voter.PasswordHash, vstatus = voter.HasVoted },
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


        public async Task<bool> UpdateVoterAsync(int vo_id, string emailid)
        {
            try
            {
                await _conn.OpenAsync();
                int result = await _conn.ExecuteAsync("UpdateVoter", new { vid = vo_id, vemail = emailid },
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


        public async Task<bool> RemoveVoterAsync(int voterid)
        {

            using (_conn)
            {
                int result = await _conn.ExecuteAsync("DeleteVoter", new { vid = voterid },
                    commandType: System.Data.CommandType.StoredProcedure);
                return result < 0;

            }
        }
        public async Task<IEnumerable<ElectionCandidateDTO>> GetAllElectionCandidatesAsync()
        {
            try
            {
                await _conn.OpenAsync();
                var query = @"
            SELECT ec.electionid, ec.candidateid, e.name as electionTitle, c.name as candidateName
            FROM electioncandidates ec
            JOIN elections e ON ec.electionid = e.e_id
            JOIN candidates c ON ec.candidateid = c.candidate_id";

                var result = await _conn.QueryAsync<ElectionCandidateDTO>(query);
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

        public async Task<string> AddCandidateToElection(int electionId, int candidateId)
        {
            try
            {
                using (_conn)
                {
                    await _conn.OpenAsync();
                    int result = await _conn.ExecuteAsync("addCandidatetoelection",
                        new { p_electionid = electionId, p_candidateid = candidateId },
                        commandType: System.Data.CommandType.StoredProcedure);

                   
                    return "Candidate added successfully";
                }
            }
            catch (NpgsqlException ex)
            {
                if (ex.Message.Contains("Candidate is already part of the election"))
                {
                    
                    return "Candidate is already part of the election";
                }
                else
                {
         
                    Console.WriteLine(ex.Message);
                    return "An error occurred while adding the candidate to the election";
                }
            }
            finally
            {
                await _conn.CloseAsync();
            }
        }


        public async Task<bool> DeleteCandidatefromElection(int electionId, int candidateId)
        {
            try
            {
                using (_conn)
                {
                    await _conn.OpenAsync();
                    int result = await _conn.ExecuteAsync("deletecandidatefromelection", new { p_electionid = electionId, p_candidateid = candidateId },
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



