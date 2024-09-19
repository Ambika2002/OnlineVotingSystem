using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineVotingSystem.CandidateRepository;
using OnlineVotingSystem.Models;
using OnlineVotingSystem.VoterRepository;

namespace OnlineVotingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CandidateController : ControllerBase
    {
        private readonly ICandidateOpt _candidateOpt;

        public CandidateController(ICandidateOpt candidateOpt)
        {
            _candidateOpt = candidateOpt;
        }


        [HttpGet("getallcandidates")]
        public async Task<IEnumerable<Candidates>> GetAllCandidatesAsync()
        {
            IEnumerable<Candidates> candidate = await _candidateOpt.GetAllCandidatesAsync();
            return candidate;
        }

        [HttpGet("getcandidatebyid/{c_id}")]
        public async Task<ActionResult<Candidates>> GetVoterAsync(int c_id)
        {
            var candidate = await _candidateOpt.GetCandidateByIdAsync(c_id);
            if (candidate == null)
            {
                return NotFound();
            }
            return candidate;
        }



    }
}
