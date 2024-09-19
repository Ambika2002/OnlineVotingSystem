using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineVotingSystem.ElectionRepository;
using OnlineVotingSystem.Models;

namespace OnlineVotingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ElectionsController : ControllerBase
    {
        private readonly IElectionOpt _electionOpt;

        public ElectionsController(IElectionOpt electionOpt)
        {
            _electionOpt = electionOpt;
        }



        [HttpGet("getcurrentelections")]
        public async Task<ActionResult<Elections>> GetCurrElectionsAsync()
        {
            var election = await _electionOpt.GetCurrentElectionAsync();
            if (election == null)
            {
                return NotFound("There's No Ongoing Election...");
            }
            return election;
        }

        [HttpGet("getallelections")]
        public async Task<IEnumerable<Elections>> GetAllElectAsync()
        {
            var election = await _electionOpt.GetAllElectionsAsync();
            return election;
        }

        [HttpGet("getelectionbyid{id}")]
        public async Task<ActionResult<Elections>> GetElectionIdAsync([FromRoute]int id)
        {
            var election = await _electionOpt.GetElectionbyIDAsync(id);
            if (election == null)
            {
                return NotFound("There's No Ongoing Election...");
            }
            return election;
        }

    }
}
