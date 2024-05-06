using Microsoft.EntityFrameworkCore;
using SchedulerAppAPICore.Core;
using SchedulerAppAPICore.Models;
using SchedulerAppAPICore.Utils;
using System.Text;

namespace SchedulerAppAPICore.Services
{
	public class UserService(ILogger<UserService> logger, DBContext context) : IUserService
	{
		private readonly ILogger<UserService> _logger = logger;
		private readonly DBContext _context = context;

		public async Task<List<User>> GetAllUsers()
		{
			try
			{
				return await _context.Users.ToListAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return [];
			}
		}

		public async Task<User?> GetUserById(int id)
		{
			try
			{
				return await _context.Users.FindAsync(id);
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return null;
			}
		}

		public async Task CreateUser(User user)
		{
			try
			{
				_context.Users.Add(user);
				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
			}
		}
		
		public async Task UpdateUser(User user)
		{
			try
			{
				var _user = await _context.Users.FindAsync(user.UserId);

				if (_user == null)
					return;

				_user.Username = user.Username;
				_user.Password = user.Password;

				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
			}
		}

		public async Task DeleteUser(int id)
		{
			try
			{
				var user = await _context.Users.FindAsync(id);

				if (user == null) return;

				_context.Users.Remove(user);
				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
			}
		}
		public async Task<User?> UserExist(string token)
		{
			try
			{
				string decodedAuthenticationToken = Encoding.UTF8.GetString(Convert.FromBase64String(token));
				string[] usernamePasswordArray = decodedAuthenticationToken.Split(':');
				string username = usernamePasswordArray[0];
				string password = usernamePasswordArray[1].Hash();

				var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username && u.Password == password);

				if (user != null)
				{
					return user;
				}
				else
				{
					_logger.LogError("User does not exist");
					return null;
				}
			}
			catch (Exception ex)
			{
				_logger.LogError($"Something went wrong. Message: {ex.Message}");
				return null;
			}
		}

		private void DefaultLogMessage(Exception ex)
		{
			_logger.Log(LogLevel.Error, $"Something went wrong. Message: {ex.Message}");
		}
	}
}
