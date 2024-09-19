using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineVotingSystem.ElectionCandidatesRepository;

namespace OnlineVotingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ElectionCandidatesController : ControllerBase
    {
        private readonly IElectionCandidateOpt _ecOpt;
        private readonly IConfiguration _config;

       public ElectionCandidatesController(IElectionCandidateOpt ecOpt, IConfiguration config)
        {
            _ecOpt = ecOpt;
            _config = config;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllECand()
        {
            var candidates = await _ecOpt.GetAllECAsync();

            return Ok(candidates);
        }

        [HttpPost("{electionid}/{candidateid}")]
        public async Task<IActionResult> InsertCandidateinElection(int electionid, int candidateid)
        {
            try
            {

                bool status = await _ecOpt.AddCandidateToElection(electionid, candidateid);
                if (!status)
                {

                    return BadRequest("Failed to update Voter Record");
                }


                return Ok("record added successfully.");
            }
            catch (Exception ex)
            {

                Console.WriteLine($"An error occurred: {ex.Message}");

                return StatusCode(500, "An error occurred while adding the voter record");

            }
        }

    }
}
