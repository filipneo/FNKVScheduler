using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchedulerAppAPICore.Core;
using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore.Controllers
{
	[ApiController]
	[Authorize]
	[Route("api/[controller]")]
	public class CalEventController(ICalEventService calEventService) : ControllerBase
	{
		private readonly ICalEventService _calEventService = calEventService;

		[HttpGet("all")]
		public async Task<List<CalEvent>> GetAll()
		{
			return await _calEventService.GetAllCalEvents();
		}

		[HttpGet("detail/{id}")]
		public async Task<ActionResult<CalEvent>> GetById(int id)
		{
			var calEvent = await _calEventService.GetCalEventById(id);

			if (calEvent == null) return NotFound();

			return Ok(calEvent);
		}

		[AllowAnonymous]
		[HttpGet("forWeek")]
		public async Task<List<CalEvent>> ForWeek([FromQuery] string date)
		{
			return await _calEventService.GetCalEventsForWeek(date);
		}

		[HttpPost("create")]
		public async Task<ActionResult<CalEvent>> Post(CalEvent calEvent)
		{
			await _calEventService.CreateCalEvent(calEvent);

			return CreatedAtAction(nameof(GetById), new { id = calEvent.CalEventId}, calEvent);
		}

		[HttpPut("update/{id}")]
		public async Task<ActionResult<CalEvent>> Put(int id, CalEvent calEvent)
		{
			if (id != calEvent.CalEventId) return BadRequest();

			var existingCalEvent = await _calEventService.GetCalEventById(id);
			if (existingCalEvent == null) return NotFound();

			await _calEventService.UpdateCalEvent(calEvent);

			var updatedAmbulance = await _calEventService.GetCalEventById(id);

			return Ok(updatedAmbulance);
		}

		[HttpDelete("delete/{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var calEvent = await _calEventService.GetCalEventById(id);

			if (calEvent == null)return NotFound();

			await _calEventService.DeleteCalEvent(id);

			return NoContent();
		}
	}
}
