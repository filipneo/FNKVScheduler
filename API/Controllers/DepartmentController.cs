using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchedulerAppAPICore.Core;
using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore.Controllers
{
	[ApiController]
	[Authorize]
	[Route("api/[controller]")]
	public class DepartmentController(IDepartmentService departmentService) : ControllerBase
	{
		private readonly IDepartmentService _departmentService = departmentService;

		[AllowAnonymous]
		[HttpGet("all")]
		public async Task<List<Department>> GetAll()
		{
			return await _departmentService.GetAllDepartments();
		}

		[HttpGet("allWithAmbulances")]
		public async Task<List<Department>> GetAllWithAmbulances()
		{
			return await _departmentService.GetAllDepartmentsWithAmbulances();
		}

		[HttpGet("detail/{id}")]
		public async Task<ActionResult<Department>> GetById(int id)
		{
			var department = await _departmentService.GetDepartmentById(id);

			if (department == null) return NotFound();

			return Ok(department);
		}

		[HttpPost("create")]
		public async Task<ActionResult<Department>> Post(Department department)
		{
			await _departmentService.CreateDepartment(department);

			return CreatedAtAction(nameof(GetById), new { id = department.DepartmentId }, department);
		}

		[HttpPut("update/{id}")]
		public async Task<ActionResult<Department>> Put(int id, Department department)
		{
			if (id != department.DepartmentId) return BadRequest();

			var existingDepartment = await _departmentService.GetDepartmentById(id);
			if (existingDepartment == null) return NotFound();

			await _departmentService.UpdateDepartment(department);

			var updatedAmbulance = await _departmentService.GetDepartmentById(id);

			return Ok(updatedAmbulance);
		}

		[HttpDelete("delete/{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var department = await _departmentService.GetDepartmentById(id);
			if (department == null) return NotFound();

			await _departmentService.DeleteDepartment(id);

			return NoContent();
		}
	}
}
