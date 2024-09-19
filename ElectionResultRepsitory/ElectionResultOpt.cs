using Dapper;
using Npgsql;
using OnlineVotingSystem.Models;

namespace OnlineVotingSystem.ElectionResultRepsitory
{
    public class ElectionResultOpt : IElectionResultOpt
    {
        NpgsqlConnection _conn;
        string str;
        IConfiguration _config;

        public ElectionResultOpt(IConfiguration config)
        {
            _config = config;
            str = _config.GetConnectionString("VoteSystemConnStr");
            _conn = new NpgsqlConnection(str);
        }
       
        public async Task<IEnumerable<ElectionResultDto>> GetElectionResultsAsync()
        {
            const string sql = @"
            SELECT 
                e.e_id AS ElectionId,
                e.description AS ElectionName,
                c.candidate_id AS CandidateId,
                c.name AS CandidateName,
                c.party AS CandidateParty,
                er.totalvotes AS TotalVotes
            FROM 
                public.electionresults er
            JOIN 
                public.elections e ON er.electionid = e.e_id
            JOIN 
                public.candidates c ON er.candidateid = c.candidate_id
            ORDER BY 
                e.e_id, c.candidate_id;
        ";

            using (_conn)
            {
                return await _conn.QueryAsync<ElectionResultDto>(sql);
            }
        }
        public async Task<ElectionResult> GetElectionResultbyIDAsync(int er_id)
        {
            try
            {
                await _conn.OpenAsync();
                var parameters = new { id = er_id };
                return await _conn.QueryFirstOrDefaultAsync<ElectionResult>("Select * from electionresults where id=@id", parameters);

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



        public async Task<IEnumerable<CandidateResult>> GetResultAsync(int electionId) { 
            var sql = @" SELECT c.candidate_id, c.Name, c.Party, er.TotalVotes, (CAST(er.TotalVotes AS float) / NULLIF((SELECT SUM(TotalVotes) FROM ElectionResults WHERE ElectionId = @ElectionId), 0)) * 100 AS VotePercentage FROM Candidates c INNER JOIN ElectionResults er ON c.candidate_id = er.CandidateId WHERE er.ElectionId = @ElectionId"; 
            var results = await _conn.QueryAsync<CandidateResult>(sql, new { ElectionId = electionId });
            return results;
        }
        public async Task<IEnumerable<CandidateResult>> GetWinnerMethod1Async(int electionId)
        {
            var results = await GetResultAsync(electionId);
            var maxVotes = results.Max(r => r.TotalVotes);
            return results.Where(r => r.TotalVotes == maxVotes);
        }

        public async Task<IEnumerable<CandidateResult>> GetElectionResultsAsync(int electionId)
{
    try
    {
        await _conn.OpenAsync();

        // Query to calculate total votes and percentage for each candidate in the election
        var sql = @"
            SELECT c.candidate_id, c.candidate_name, c.candidate_party, COUNT(v.vote_id) AS totalVotes,
                   (COUNT(v.vote_id) * 100.0 / SUM(COUNT(v.vote_id)) OVER()) AS votePercentage
            FROM candidates c
            LEFT JOIN votes v ON c.candidate_id = v.candidate_id
            WHERE c.election_id = @electionId
            GROUP BY c.candidate_id, c.candidate_name, c.candidate_party
            ORDER BY totalVotes DESC;
        ";

        var result = await _conn.QueryAsync<CandidateResult>(sql, new { electionId });
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

public async Task<CandidateResult> GetWinnerAsync(int electionId)
{
    try
    {
        await _conn.OpenAsync();

        // Query to get the candidate with the most votes
        var sql = @"
            SELECT c.candidate_id, c.candidate_name, c.candidate_party, COUNT(v.vote_id) AS totalVotes
            FROM candidates c
            LEFT JOIN votes v ON c.candidate_id = v.candidate_id
            WHERE c.election_id = @electionId
            GROUP BY c.candidate_id, c.candidate_name, c.candidate_party
            ORDER BY totalVotes DESC
            LIMIT 1;
        ";

        var winner = await _conn.QueryFirstOrDefaultAsync<CandidateResult>(sql, new { electionId });
        return winner;
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
