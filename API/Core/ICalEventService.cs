using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore.Core
{
	public interface ICalEventService
	{
		Task<List<CalEvent>> GetAllCalEvents();
		Task<CalEvent?> GetCalEventById(int id);
		Task CreateCalEvent(CalEvent calevent);
		Task UpdateCalEvent(CalEvent updatedCalEvent);
		Task DeleteCalEvent(int id);
		Task<List<CalEvent>> GetCalEventsForWeek(string date);
	}
}