using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using OnlineVotingSystem.ElectionResultRepsitory;
using OnlineVotingSystem.Models;
using OnlineVotingSystem.VoterInfoRepository;
using OnlineVotingSystem.VoterRepository;
using System.ComponentModel.Design;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace OnlineVotingSystem.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class VoterController : ControllerBase
    {
        private readonly IVoterOpt _voterOpt;
        private readonly IVoterInfoOpt _voterInfoOpt;
        private readonly ILogger<VoterController> _logger;
        private readonly IElectionResultOpt _electionResultOpt;
        private readonly IConfiguration _config;

        public VoterController(IVoterOpt voteropt, IVoterInfoOpt voterInfoOpt, ILogger<VoterController> logger,IConfiguration config)
        {
            _voterOpt = voteropt;
            _voterInfoOpt = voterInfoOpt;
            _logger = logger;
            _config = config;

        }

        [HttpGet]
        public async Task<IActionResult> GetAllVotersAsync()
        {
            var voters = await _voterOpt.GetAllVoterAsync();
            return new OkObjectResult(voters);
        }

            [HttpGet("{voterid}")]
        public async Task<IActionResult> GetVoterAsync(int voterid)
        {
            var voter = await _voterOpt.GetVoterByIdAsync(voterid);
            if (voter == null)
            {
                _logger.LogError(DateTime.Now + "Voter Data couldn't be fetched");
                return NotFound();
            }
            _logger.LogInformation(DateTime.Now + "Data fetched : {@voter}", voter);
            return new OkObjectResult(voter);
        }

        [HttpGet("{votid}")]
        public async Task<IActionResult> GetVoterbyVIdAsync(string votid)
        {
            var voter = await _voterOpt.GetVoterByVotIdAsync(votid);
            if (voter == null)
            {
                _logger.LogError(DateTime.Now + "Voter Data couldn't be fetched");
                return NotFound();
            }

            _logger.LogInformation(DateTime.Now + "Data fetched : {@voter}", voter);


            return new OkObjectResult(voter);
        }


        [HttpPost]
        public async Task<IActionResult> RegisterVoter([FromBody] VoterRequest request)
        {
            if (request == null)
            {
                _logger.LogError(DateTime.Now + "Bad Request..values not matching");
                return BadRequest("Request body cannot be null");
            }

          
            var voterRecord = await _voterInfoOpt.GetVoterByVoterId(request.VoterId);
            if (voterRecord == null)
            {
                _logger.LogError(DateTime.Now + "Voter doesn't exist");
                return BadRequest("Invalid Voter Id");
            }


            var existingVoterById = await _voterOpt.GetVoterByVotIdAsync(request.VoterId);
            if (existingVoterById != null)
            {
                _logger.LogError(DateTime.Now + "Voter ID is already registered");
                return BadRequest("This Voter Id is already registered");
            }

            var existingVoterByEmail = await _voterOpt.GetVoterByEmailIdAsync(request.Email);
            if (existingVoterByEmail != null)
            {
                _logger.LogError(DateTime.Now + "Email Id is already registered");
                return BadRequest("This Email Id is already registered");
            }


            var newVoter = new Voters
            {
                VotId = request.VoterId,
                Name = voterRecord.name,
                Email = request.Email,
                PasswordHash = request.PasswordHash,
                HasVoted = false
            };

            try
            {
             
                var isAdded = await _voterOpt.AddVoterAsync(newVoter);

                if (!isAdded)
                {
                    _logger.LogCritical(DateTime.Now + "An error occurred while registering the voter");
                    return StatusCode(500, new { message = "An error occurred while registering the voter" });
                }



                _logger.LogInformation(DateTime.Now + "Registerion successful ...@{newVoter}");
           
                return new OkObjectResult(new { message = "Registration successful", voter = newVoter });

            }
            catch (Exception ex)
            {
              
                Console.WriteLine(ex.Message);
                _logger.LogCritical(DateTime.Now + "An error occurred while registering the voter");
                return StatusCode(500, new { message = "An unexpected error occurred", details = ex.Message });
            }
        }




        [HttpPost]
        public async Task<IActionResult> LoginVoter([FromBody] VoterLoginRequest request)
        {
            if (request == null)
            {
                _logger.LogCritical(DateTime.Now + "Requested body is null");
                return BadRequest(new { message = "Request body cannot be null" });
            }

            // Fetch the voter record from the database by VoterId
            var voter = await _voterOpt.GetVoterByVotIdAsync(request.VoterId);
            if (voter == null)
            {
                _logger.LogCritical(DateTime.Now + "Invalid credentials");
                return NotFound(new { message = "Invalid credentials! Voter not found with the provided Voter Id and Password" });
            }

         
            if (voter.PasswordHash != request.PasswordHash)
            {
                _logger.LogCritical(DateTime.Now + "Invalid Credentials");
                return Unauthorized(new { message = "Invalid Voter Id or Password" });
            }

          
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Name, voter.Name), 
            new Claim("VoterId", voter.VotId.ToString()), 
        }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = signIn
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new
            {
                Token = tokenString,
                message = "Login successful",
                voter = new
                {
                    VoterId = request.VoterId,
                    Name = voter.Name,
                    Email = voter.Email,
                    VotingStatus = voter.HasVoted
                }
            });
        }


        [HttpGet("{voterId}")]
        public async Task<IActionResult> GetActiveElectionsWithCandidates(string voterId)
        {
            try
            {
               
                bool hasVoted = await _voterOpt.HasVotedAsync(voterId);
                if (hasVoted)
                {
                    _logger.LogError(DateTime.Now + "Duplicate vote");
                    return BadRequest("You have already cast your vote.");
                }

               
                var ongoingElections = await _voterOpt.GetOngoingElectionsAsync();

         
                var electionsWithCandidates = new List<object>();
                foreach (var election in ongoingElections)
                {
                    var candidates = await _voterOpt.GetCandidatesForElectionAsync(election.E_Id);
                    electionsWithCandidates.Add(new
                    {
                        election,
                        candidates
                    });
                }
               
                return Ok(electionsWithCandidates);
            }
            catch (Exception ex)
            {
           
                _logger.LogCritical(DateTime.Now + "An error occurred while processing");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }



        [HttpGet]
        public async Task<IActionResult> GetAllCandidatesAsync()
        {
            IEnumerable<Candidates> candidate = await _voterOpt.GetAllCandidatesAsync();
            
            _logger.LogInformation(DateTime.Now + "Information Logs..details fetched...{@candidate}");
            
            return new OkObjectResult(candidate);
        }



        [HttpGet("{voterId}")]
        public async Task<IActionResult> HasVoted(string voterId)
        {
            try
            {
                bool hasVoted = await _voterOpt.HasVotedAsync(voterId);
               _logger.LogInformation(DateTime.Now + "Information Logs..voting status : {@HasVoted}");
                return Ok(new { HasVoted = hasVoted });
            }
            catch (Exception ex)
            {
                
                _logger.LogCritical(DateTime.Now + "An error occurred while processing");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CastVote([FromBody] VoteRequest voteRequest)
        {
            if (voteRequest == null || voteRequest.electionid <= 0 || voteRequest.candidateid <= 0)
            {
                _logger.LogCritical(DateTime.Now + "Invalid request");
                return BadRequest("Invalid vote request.");
            }


          
            bool hasVoted = await _voterOpt.HasVotedAsync(voteRequest.VoterId);
            if (hasVoted)
            {
                return BadRequest("You have already cast your vote.");
            }


            var result = await _voterOpt.CastVoteAsync(voteRequest.electionid, voteRequest.candidateid);


            if (!result)
            {
                return StatusCode(500, "An error occurred while casting the vote.");
            }

     
            bool markVotedResult = await _voterOpt.MarkVoterAsVotedAsync(voteRequest.VoterId);
            if (!markVotedResult)
            {
                _logger.LogError(DateTime.Now + "An error occurred while updating the status");
                return StatusCode(500, "An error occurred while updating the voter status.");
             
            }

           
            _logger.LogInformation(DateTime.Now + "Voting info");
            return Ok("Vote cast successfully.");
        }

        [HttpGet]
        public async Task<IEnumerable<Elections>> GetAllElectAsync()
        {
            var election = await _voterOpt.GetAllElectionsAsync();
            
            _logger.LogInformation(DateTime.Now + "Information Logs..details fetched....{@election}");

            return election;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Elections>> GetElectionIdAsync([FromRoute] int id)
        {
            var election = await _voterOpt.GetElectionbyIDAsync(id);
            
            _logger.LogInformation(DateTime.Now + "Information Elections : {@election}");
           

            if (election == null)
            {
                _logger.LogError(DateTime.Now+"No ongoing election found");
                return NotFound("There's No Ongoing Election...");
            }
            return election;
        }

      
        [HttpGet("{er_id}")]
        public async Task<ActionResult> GetResultInfo(int er_id)
        {
            try
            {
               
                var results = await _electionResultOpt.GetResultAsync(er_id);
                _logger.LogInformation(DateTime.Now + "Information Elections : {@results}");
                return Ok(results);

            }
            catch (Exception ex)
            {
              
                _logger.LogError(DateTime.Now + "Internal Server Error");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


    }
}


