using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Neo4j.Driver;
using Neo4jTest;

[ApiController]
[Route("api/[controller]")]
public class Neo4jController : ControllerBase
{
   private readonly Neo4jService _neo4jService;

    public Neo4jController(Neo4jService neo4jService)
    {
        _neo4jService = neo4jService;
    }


    [HttpGet("api/getPlayers")]
    public async Task<IActionResult> GetPlayers(string teamName)
    {
        try
        {
            var players = await _neo4jService.GetPlayers(teamName);
            return Ok(players);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("api/getGames")]
    public async Task<IActionResult> GetGames(string teamName, string side)
    {
        try
        {
            var games = await _neo4jService.GetGames(teamName, side);
            return Ok(games);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("api/getClubs")]
    public async Task<IActionResult> GetClubs()
    {
        try
        {
            var clubs = await _neo4jService.GetClubs();
            return Ok(clubs);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("api/getCoaches")]
    public async Task<IActionResult> GetCoaches()
    {
        try
        {
            var coaches = await _neo4jService.GetCoaches();
            return Ok(coaches);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("api/getFreeCoaches")]
    public async Task<IActionResult> GetFreeCoaches()
    {
        try
        {
            var coaches = await _neo4jService.GetFreeCoaches();
            return Ok(coaches);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPut("api/setNewCoach")]
    public async Task<IActionResult> SetNewCoach(string teamName, string coachName)
    {
        try
        {
            await _neo4jService.SetNewCoach(teamName, coachName);
            return Ok("Coach successfully set.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpDelete("api/deleteCoach")]
    public async Task<IActionResult> DeleteCoach(string coachName)
    {
        try
        {
            await _neo4jService.DeleteCoach(coachName);
            return Ok("Coach successfully deleted.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost("api/CreateNewGame")]
    public async Task<IActionResult> CreateNewGame(string hostName, int hostGoals, string guestName, int guestGoals, int round)
    {
        try
        {
            await _neo4jService.CreateNewGame(hostName, hostGoals, guestName, guestGoals, round);
            return Ok("New game successfully set.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
