using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineVotingSystem.ElectionRepository;
using OnlineVotingSystem.ElectionResultRepsitory;
using OnlineVotingSystem.Models;
using OnlineVotingSystem.VoterRepository;

namespace OnlineVotingSystem.Controllers
{
    
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ElectionResultController : ControllerBase
    {
        private readonly IElectionResultOpt _electionresultOpt;
        private readonly IVoterOpt _voterOpt;
        private readonly IElectionOpt _electionOpt;

        public ElectionResultController(IElectionResultOpt electionresultOpt, IVoterOpt voterOpt, IElectionOpt electionOpt)
        {
            _electionresultOpt = electionresultOpt;
            _voterOpt = voterOpt;
            _electionOpt = electionOpt;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ElectionResultDto>>> GetElectionResults()
        {
            try
            {
                var results = await _electionresultOpt.GetElectionResultsAsync();
                return Ok(results);
            }
            catch (Exception ex)
            {
          
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        [HttpGet("{id}")]
        public async Task<ActionResult<ElectionResult>> GetResultIdAsync([FromRoute] int id)
        {
            var election = await _electionresultOpt.GetElectionResultbyIDAsync(id);
            if (election == null)
            {
                return NotFound("No Record found...");
            }
            return election;
        }

        [HttpGet("{er_id}")]
        public async Task<ActionResult> GetResultInfo(int er_id)
        {
            try
            {
                var results = await _electionresultOpt.GetResultAsync(er_id);
                return Ok(results);
            }
            catch (Exception ex)
            {
               
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        [HttpGet("{id}")]
        public async Task<ActionResult> GetWinnerAsync([FromRoute] int id)
        {
            var election = await _electionresultOpt.GetWinnerMethod1Async(id);
            if (election == null)
            {
                return NotFound("No Record found...");
            }
            return Ok(election);
        }

       
        [HttpGet("{electionId}")]
        public async Task<IActionResult> GetElectionResults(int electionId)
        {
            var results = await _electionresultOpt.GetElectionResultsAsync(electionId);
            if (results == null || !results.Any())
            {
                return NotFound("No results found for this election.");
            }

            return Ok(results);
        }

        [HttpGet("{electionId}")]
        public async Task<IActionResult> GetWinnerByEID(int electionId)
        {
            var winner = await _electionresultOpt.GetWinnerAsync(electionId);
            if (winner == null)
            {
                return NotFound("No winner found for this election.");
            }

            return Ok(winner);
        }
    }
}
