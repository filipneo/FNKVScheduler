using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore.Core
{
	public interface IVacationService
	{
		Task<List<Vacation>> GetAllVacations();
		Task<Vacation?> GetVacationById(int id);
		Task CreateVacation(Vacation vacation);
		Task UpdateVacation(Vacation vacation);
		Task DeleteVacation(int id);
		Task<Vacation?> RequestVacation(Vacation vacation);
		Task<List<Vacation>> GetVacationsByFilter(int[] state, int[] category, string from, string to);
	}
}