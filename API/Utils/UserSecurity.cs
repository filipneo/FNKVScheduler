using Microsoft.EntityFrameworkCore;

namespace SchedulerAppAPICore.Utils
{
	public class UserSecurity(DBContext context)
	{
		public async Task<bool> Login(string username, string password)
		{
			password = password.Hash();
			return await context.Users.AnyAsync(u => u.Username == username && u.Password == password);
		}
	}
}
