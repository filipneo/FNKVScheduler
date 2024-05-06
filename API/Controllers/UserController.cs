using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchedulerAppAPICore.Core;
using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class UserController(IUserService userService) : ControllerBase
	{
		private readonly IUserService _userService = userService;

		[HttpGet("all")]
		public async Task<List<User>> GetAll()
		{
			return await _userService.GetAllUsers();
		}

		[HttpGet("detail/{id}")]
		public async Task<ActionResult<User>> GetById(int id)
		{
			var user = await _userService.GetUserById(id);

			if (user == null) return NotFound();

			return Ok(user);
		}

		[HttpPost("create")]
		public async Task<ActionResult<User>> Post(User user)
		{
			await _userService.CreateUser(user);

			return CreatedAtAction(nameof(GetById), new { id = user.UserId }, user);
		}

		[HttpPut("update/{id}")]
		public async Task<ActionResult<User>> Put(int id, User user)
		{
			if (id != user.UserId) return BadRequest();

			var existingUser = await _userService.GetUserById(id);
			if (existingUser == null) return NotFound();

			await _userService.UpdateUser(user);

			var updatedUser = await _userService.GetUserById(id);

			return Ok(updatedUser);
		}

		[AllowAnonymous]
		[HttpGet("exist")]
		public async Task<ActionResult<User>> UserExist(string token)
		{
			var user = await _userService.UserExist(token);

			if (user == null) return NotFound();

			return Ok(user);
		}

		[AllowAnonymous]
		[HttpGet("checkConnection")]
		public ActionResult CheckConnection()
		{
			return Ok();
		}

		[HttpDelete("delete/{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var user = await _userService.GetUserById(id);

			if (user == null) return NotFound();

			await _userService.DeleteUser(id);

			return NoContent();
		}
	}
}
