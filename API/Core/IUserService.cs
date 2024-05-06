using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore.Core
{
	public interface IUserService
	{
		Task<List<User>> GetAllUsers();
		Task<User?> GetUserById(int id);
		Task CreateUser(User user);
		Task UpdateUser(User user);
		Task DeleteUser(int id);
		Task<User?> UserExist(string token);
	}
}
