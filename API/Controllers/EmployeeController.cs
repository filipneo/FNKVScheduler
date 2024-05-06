using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchedulerAppAPICore.Core;
using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore.Controllers
{
	[ApiController]
	[Authorize]
	[Route("api/[controller]")]
	public class EmployeeController(IEmployeeService employeeService) : ControllerBase
	{
		private readonly IEmployeeService _employeeService = employeeService;

		[AllowAnonymous]
		[HttpGet("all")]
		public async Task<List<Employee>> GetAll()
		{
			return await _employeeService.GetAllEmployees();
		}

		[HttpGet("detail/{id}")]
		public async Task<ActionResult<Employee>> GetById(int id)
		{
			var employee = await _employeeService.GetEmployeeById(id);

			if (employee == null) return NotFound();

			return Ok(employee);
		}

		[HttpGet("free")]
		public async Task<List<Employee>> GetFreeForDate([FromQuery] string date)
		{
			return await _employeeService.GetFreeEmployeesForDate(date);
		}

		[HttpPost("create")]
		public async Task<ActionResult<Employee>> Post(Employee employee)
		{
			await _employeeService.CreateEmployee(employee);

			return CreatedAtAction(nameof(GetById), new { id = employee.EmployeeId }, employee);
		}

		[HttpPut("update/{id}")]
		public async Task<ActionResult<Employee>> Put(int id, Employee employee)
		{
			if (id != employee.EmployeeId) return BadRequest();

			var existingEmployee = await _employeeService.GetEmployeeById(id);
			if (existingEmployee == null) return NotFound();

			await _employeeService.UpdateEmployee(employee);

			var updatedEmployee = await _employeeService.GetEmployeeById(id);

			return Ok(updatedEmployee);
		}

		[HttpDelete("delete/{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var employee = await _employeeService.GetEmployeeById(id);
			if (employee == null) return NotFound();

			await _employeeService.DeleteEmployee(id);

			return NoContent();
		}

		[HttpGet("byCategory")]
		public async Task<List<Employee>> ByCategory([FromQuery] int[] category)
		{
			return await _employeeService.GetEmployeesByCategory(category);
		}
	}
}
