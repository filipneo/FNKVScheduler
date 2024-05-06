using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore.Core
{
	public interface IShiftService
	{
		Task<List<Shift>> GetAllShifts();
		Task<Shift?> GetShiftById(int id);
		Task<Shift?> CreateShift(Shift shift);
		Task UpdateShift(Shift shift);
		Task DeleteShift(int id);
		Task<bool> CopyWeek(string dateFrom, string dateTo);
		Task<bool> GenFromPref(string date);
		Task<List<Shift>> GetShiftsByDate(string date);
		Task<List<Shift>> GetShiftsForWeek(string date);
	}
}
