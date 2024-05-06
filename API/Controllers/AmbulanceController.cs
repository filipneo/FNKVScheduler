using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchedulerAppAPICore.Core;
using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class AmbulanceController(IAmbulanceService ambulanceService) : ControllerBase
    {
        private readonly IAmbulanceService _ambulanceService = ambulanceService;

        [AllowAnonymous]
        [HttpGet("all")]
        public async Task<List<Ambulance>> GetAll()
        {
            return await _ambulanceService.GetAllAmbulances();
        }

        [HttpGet("detail/{id}")]
        public async Task<ActionResult<Ambulance>> GetById(int id)
        {
            var ambulance = await _ambulanceService.GetAmbulanceById(id);

            if (ambulance == null) return NotFound();

            return Ok(ambulance);
        }

        [HttpPost("create")]
        public async Task<ActionResult<Ambulance>> Post(Ambulance ambulance)
        {
            await _ambulanceService.CreateAmbulance(ambulance);

            return CreatedAtAction(nameof(GetById), new { id = ambulance.AmbulanceId }, ambulance);
        }

        [HttpPut("update/{id}")]
        public async Task<ActionResult<Ambulance>> Put(int id, Ambulance ambulance)
        {
            if (id != ambulance.AmbulanceId) return BadRequest();

            var existingAmbulance = await _ambulanceService.GetAmbulanceById(id);
            if (existingAmbulance == null) return NotFound();

            await _ambulanceService.UpdateAmbulance(ambulance);

            var updatedAmbulance = await _ambulanceService.GetAmbulanceById(id);

            return Ok(updatedAmbulance);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ambulance = await _ambulanceService.GetAmbulanceById(id);
            if (ambulance == null)
                return NotFound();

            await _ambulanceService.DeleteAmbulance(id);

            return NoContent();
        }
    }
}
