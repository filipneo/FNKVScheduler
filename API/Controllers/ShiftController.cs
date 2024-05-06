using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchedulerAppAPICore.Core;
using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore.Controllers
{
	[ApiController]
	[Authorize]
	[Route("api/[controller]")]
	public class ShiftController(IShiftService shiftService) : ControllerBase
	{
		private readonly IShiftService _shiftService = shiftService;

		[HttpGet("all")]
		public async Task<List<Shift>> GetAll()
		{
			return await _shiftService.GetAllShifts();
		}

		[HttpGet("detail/{id}")]
		public async Task<ActionResult<Shift>> GetById(int id)
		{
			var shift = await _shiftService.GetShiftById(id);

			if (shift == null) return NotFound();

			return Ok(shift);
		}

		[HttpPost("create")]
		public async Task<ActionResult<Shift>> Post(Shift shift)
		{
			var createdShift = await _shiftService.CreateShift(shift);

			if (createdShift == null) return BadRequest(shift);

			return createdShift;
		}

		[HttpPut("update/{id}")]
		public async Task<ActionResult<Shift>> Put(int id, Shift shift)
		{
			if (id != shift.ShiftId) return BadRequest();

			var existingShift = await _shiftService.GetShiftById(id);
			if (existingShift == null) return NotFound();

			await _shiftService.UpdateShift(shift);

			var updatedShift = await _shiftService.GetShiftById(id);
			
			return Ok(updatedShift);
		}

		[HttpDelete("delete/{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var shift = await _shiftService.GetShiftById(id);
			if (shift == null) return NotFound();

			await _shiftService.DeleteShift(id);

			return NoContent();
		}

		[AllowAnonymous]
		[HttpGet("forWeek")]
		public async Task<List<Shift>> ForWeek([FromQuery] string date)
		{
			if (date == null) return [];

			return await _shiftService.GetShiftsForWeek(date);
		}

		[HttpGet("byDate")]
		public async Task<List<Shift>> ForDate([FromQuery] string date)
		{
			if (date == null) return [];

			return await _shiftService.GetShiftsByDate(date);
		}

		[HttpGet("genFromPref")]
		public async Task<IActionResult> Generate([FromQuery] string date)
		{
			if (date == null) return BadRequest();

			bool successful = await _shiftService.GenFromPref(date);

			if (successful) return Ok();

			return NotFound();
		}

		[HttpGet("copyWeek")]
		public async Task<IActionResult> Copy([FromQuery] string dateFrom, [FromQuery] string dateTo)
		{
			if(dateFrom == null || dateTo == null) return BadRequest();

			bool successful = await _shiftService.CopyWeek(dateFrom, dateTo);

			if (successful) return Ok();

			return NotFound();
		}
	}
}