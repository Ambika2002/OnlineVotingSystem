using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using OnlineVotingSystem.AdminRepository;
using OnlineVotingSystem.CandidateRepository;
using OnlineVotingSystem.ElectionRepository;
using OnlineVotingSystem.ElectionResultRepsitory;
using OnlineVotingSystem.Models;
using OnlineVotingSystem.VoterRepository;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]/[action]")]
public class AdminController : ControllerBase
{
    private readonly IAdminOpt _adminRepository;
    private readonly ICandidateOpt _candidateRepository;
    private readonly IElectionOpt _electionRepository;
    private readonly IVoterOpt _voterRepository;
    private readonly IElectionResultOpt _resultRepository;
    private readonly IConfiguration _config;


    public AdminController(IAdminOpt adminRepository, ICandidateOpt candidateRepository, IElectionOpt electionRepository, IVoterOpt voterRepository, IElectionResultOpt resultOpt, IConfiguration config)
    {
        _adminRepository = adminRepository;
        _candidateRepository = candidateRepository;
        _electionRepository = electionRepository;
        _voterRepository = voterRepository;
        _resultRepository = resultOpt;
        _config = config;

    }

    [HttpPost]
    public async Task<IActionResult> Login([FromBody] AdminLoginRequest loginRequest)
    {
        // Fetch admin by username
        var admin = await _adminRepository.GetAdminByUsernameAsync(loginRequest.UserName);

        // If admin not found or password does not match, return Unauthorized
        if (admin == null || !VerifyPassword(admin.PasswordHash, loginRequest.Password))
        {
            return Unauthorized();
        }

        // Generate JWT token
        var tokenHandler = new JwtSecurityTokenHandler();

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
            new Claim(ClaimTypes.Name, admin.Username),
            new Claim("AdminId", admin.Id.ToString()) 
        }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = signIn
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        return Ok(new { Token = tokenString });
    }


    [HttpGet]
    public async Task<IActionResult> GetAllCandidates()
    {
        var candidates = await _candidateRepository.GetAllCandidatesAsync();

        return Ok(candidates);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllElections()
    {
        var elections = await _electionRepository.GetAllElectionsAsync();

        return Ok(elections);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllVoters()
    {
        var voters = await _voterRepository.GetAllVoterAsync();

        return new JsonResult(voters);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllElectionCandidates()
    {
        var ec = await _adminRepository.GetAllElectionCandidatesAsync();

        return Ok(ec);
    }

    [HttpPost]
    public async Task<IActionResult> InsertVoter([FromBody] Voters voter)
    {
        if (voter == null)
        {

            return BadRequest("Voter data is required.");
        }

        try
        {

            await _adminRepository.AddVoterAsync(voter);

            return Ok("Voter record added successfully.");
        }
        catch (Exception ex)
        {

            Console.WriteLine($"An error occurred: {ex.Message}");

            return StatusCode(500, "An error occurred while adding the voter record");

        }
    }
    [HttpPost("{electionid}/{candidateid}")]
    public async Task<IActionResult> InsertCandidateinElection(int electionid, int candidateid)
    {
        try
        {
           
            string resultMessage = await _adminRepository.AddCandidateToElection(electionid, candidateid);

          
            if (resultMessage == "Candidate is already part of the election")
            {
                return Conflict(resultMessage); // 409 Conflict
            }

            // If operation succeeded, return success message
            return NoContent();// 200 OK
        }
        catch (Exception ex)
        {
           
            Console.WriteLine($"An error occurred: {ex.Message}");
            return StatusCode(500, "An error occurred while adding the candidate to the election.");
        }
    }


   

    [HttpDelete("{electionid}/{candidateid}")]
    public async Task<IActionResult> RemoveCandidatefromElection(int electionid, int candidateid)
    {
    var result = await _adminRepository.DeleteCandidatefromElection(electionid,candidateid);
    return result ? Ok() : StatusCode(500);
}

[HttpPut("{id}/{emailid}")]
    public async Task<IActionResult> UpdateVoter([FromRoute] int id, [FromRoute] string emailid)
    {
        var status = await _adminRepository.UpdateVoterAsync(id, emailid);

        if (!status)
        {
         
            return BadRequest("Failed to update Voter Record");
        }
      
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Voters>> DeleteVoterAsync([FromRoute] int id)
    {
        var status = await _adminRepository.RemoveVoterAsync(id);
        if (!status)
        {
         
            return BadRequest("failed to delete voter record");
        }
        
        return NoContent();
    }

    [HttpPost("{cname}/{cparty}")]
    public async Task<IActionResult> AddCandidate([FromRoute]string cname, [FromRoute]string cparty )
    {
        var status = await _adminRepository.AddCandidateAsync(cname,cparty);
        if (!status)
        {
           
            return BadRequest("Failed to Add Candidate Record");
        }
        return NoContent();
    }

    [HttpPut("{id}/{party_name}")]
    public async Task<IActionResult> UpdateCandidateAsync(int id, string party_name)
    {

        var status = await _adminRepository.UpdateCandidateAsync(id, party_name);

        if (!status)
        {
           
            return BadRequest("Failed to update Candidate Record");
        }
        return NoContent();

    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCandidate(int id)
    {
        var result = await _adminRepository.RemoveCandidateAsync(id);
        return result ? Ok() : StatusCode(500);
    }

    [HttpPost]
    public async Task<IActionResult> AddElection([FromBody] Elections election)
    {
        var result = await _adminRepository.AddElectionAsync(election);
        return result ? Ok() : StatusCode(500);
    }

    [HttpPut("{id}/{e_name}/{e_descr}")]
    public async Task<IActionResult> UpdateElectionDetails([FromRoute]int id, [FromRoute]string e_name, [FromRoute]string e_descr)
    {
        var result = await _adminRepository.UpdateElectionDetailAsync(id,e_name,e_descr);
        return result ? Ok() : StatusCode(500);
    }


    [HttpPut("{id}/{start}/{end}")]
    public async Task<IActionResult> UpdateElectionDateAsync([FromRoute] int id, [FromRoute] DateTime start, [FromRoute] DateTime end)
    {
        var result = await _adminRepository.UpdateElectionPeriodAsync(id, start, end);
        return result ? Ok() : StatusCode(500);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteElection([FromRoute]int id)
    {
        var result = await _adminRepository.RemoveElectionAsync(id);
        return result ? Ok() : StatusCode(500);
    }

    private bool VerifyPassword(string storedHash, string password)
    {
        // Password verification logic
        return storedHash == password; 
    }
}
