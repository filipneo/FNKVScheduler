using Microsoft.EntityFrameworkCore;
using SchedulerAppAPICore.Core;
using SchedulerAppAPICore.Models;
using SchedulerAppAPICore.Utils;

namespace SchedulerAppAPICore.Services
{
	public class CalEventService(ILogger<CalEventService> logger, DBContext context) : ICalEventService
	{
		private readonly ILogger<CalEventService> _logger = logger;
		private readonly DBContext _context = context;

		public async Task<List<CalEvent>> GetAllCalEvents()
		{
			try
			{
				return await _context.CalEvents.ToListAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return [];
			}
		}

		public async Task<CalEvent?> GetCalEventById(int id)
		{
			try
			{
				return await _context.CalEvents.FindAsync(id);
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return null;
			}
		}

		public async Task CreateCalEvent(CalEvent calEvent)
		{
			try
			{
				_context.CalEvents.Add(calEvent);
				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
			}
		}

		public async Task UpdateCalEvent(CalEvent calEvent)
		{
			try
			{
				var _calEvent = await _context.CalEvents.FindAsync(calEvent.CalEventId);

				if (_calEvent == null) return;

				_calEvent.Name = calEvent.Name;
				_calEvent.Color = calEvent.Color;
				_calEvent.Note = calEvent.Note;
				_calEvent.From = calEvent.From;
				_calEvent.To = calEvent.To;

				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
			}
		}

		public async Task<List<CalEvent>> GetCalEventsForWeek(string date)
		{
			try
			{
				DateTime fromDate = Extensions.DateStringToDate(date);
				DateTime toDate = fromDate.AddDays(7);

				return await _context.CalEvents.Where(calEvent => calEvent.From <= toDate && fromDate <= calEvent.To).ToListAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return [];
			}
		}

		public async Task DeleteCalEvent(int id)
		{
			try
			{
				var calEvent = await _context.CalEvents.FindAsync(id);

				if (calEvent == null) return;

				_context.CalEvents.Remove(calEvent);
				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
			}
		}

		private void DefaultLogMessage(Exception ex)
		{
			_logger.Log(LogLevel.Error, $"Something went wrong. Message: {ex.Message}");
		}
	}
}
