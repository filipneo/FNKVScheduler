using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchedulerAppAPICore.Core;
using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class VacationController(IVacationService vacationService) : ControllerBase
	{
		private readonly IVacationService _vacationService = vacationService;

		[HttpGet("all")]
		public async Task<List<Vacation>> GetAll()
		{
			return await _vacationService.GetAllVacations();
		}

		[HttpGet("detail/{id}")]
		public async Task<ActionResult<Vacation>> GetById(int id)
		{
			var vacation = await _vacationService.GetVacationById(id);

			if (vacation == null) return NotFound();

			return Ok(vacation);
		}

		[AllowAnonymous]
		[HttpGet("byFilter")]
		public async Task<List<Vacation>> ByFilter([FromQuery] int[] state, [FromQuery] int[] category, [FromQuery] string from = "", [FromQuery] string to = "")
		{
			return await _vacationService.GetVacationsByFilter(state, category, from, to);
		}

		[HttpPost("create")]
		public async Task<ActionResult<Vacation>> Post(Vacation vacation)
		{
			await _vacationService.CreateVacation(vacation);

			return CreatedAtAction(nameof(GetById), new { id = vacation.VacationId }, vacation);
		}

		[HttpPut("update/{id}")]
		public async Task<ActionResult<Vacation>> Put(int id, Vacation vacation)
		{
			if (id != vacation.VacationId) return BadRequest();

			var existingVacation = await _vacationService.GetVacationById(id);
			if (existingVacation == null) return NotFound();

			await _vacationService.UpdateVacation(vacation);

			var updatedVacation = await _vacationService.GetVacationById(id);

			return Ok(updatedVacation);
		}

		[AllowAnonymous]
		[HttpPost("request")]
		public async Task<ActionResult<Vacation>> Request(Vacation vacation)
		{
			var createdVacation = await _vacationService.RequestVacation(vacation);

			if (createdVacation == null)
			{
				return BadRequest();
			}

			return Ok(createdVacation);
		}

		[HttpDelete("delete/{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var vacation = await _vacationService.GetVacationById(id);
			if (vacation == null) return NotFound();

			await _vacationService.DeleteVacation(id);

			return NoContent();
		}

	}
}
