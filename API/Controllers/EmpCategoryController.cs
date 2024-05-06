using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchedulerAppAPICore.Core;
using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore.Controllers
{
	[ApiController]
	[Authorize]
	[Route("api/[controller]")]
	public class EmpCategoryController(IEmpCategoryService empCategoryService) : ControllerBase
	{
		private readonly IEmpCategoryService _empCategoryService = empCategoryService;

		[AllowAnonymous]
		[HttpGet("all")]
		public async Task<IEnumerable<EmpCategory>> GetAll()
		{
			return await _empCategoryService.GetAllEmpCategories();
		}

		[HttpGet("detail/{id}")]
		public async Task<ActionResult<EmpCategory>> GetById(int id)
		{
			var empCategory = await _empCategoryService.GetEmpCategoryById(id);

			if (empCategory == null) return NotFound();

			return Ok(empCategory);
		}

		[HttpPost("create")]
		public async Task<ActionResult<EmpCategory>> Post(EmpCategory empCategory)
		{
			await _empCategoryService.CreateEmpCategory(empCategory);

			return CreatedAtAction(nameof(GetById), new { id = empCategory.EmpCategoryId}, empCategory);
		}

		[HttpPut("update/{id}")]
		public async Task<ActionResult<EmpCategory>> Put(int id, EmpCategory empCategory)
		{
			if (id != empCategory.EmpCategoryId) return BadRequest();

			var existingEmpCategory = await _empCategoryService.GetEmpCategoryById(id);
			if (existingEmpCategory == null) return NotFound();

			await _empCategoryService.UpdateEmpCategory(empCategory);

			var updatedEmpCategory = await _empCategoryService.GetEmpCategoryById(id);

			return Ok(updatedEmpCategory);
		}

		[HttpDelete("delete/{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var empCategory = await _empCategoryService.GetEmpCategoryById(id);
			if (empCategory == null) return NotFound();

			await _empCategoryService.DeleteEmpCategory(id);

			return NoContent();
		}

	}
}
