using Microsoft.EntityFrameworkCore;
using SchedulerAppAPICore.Core;
using SchedulerAppAPICore.Models;
using SchedulerAppAPICore.Utils;

namespace SchedulerAppAPICore.Services
{
	public class VacationService(ILogger<VacationService> logger, DBContext context) : IVacationService
	{
		private readonly ILogger<VacationService> _logger = logger;
		private readonly DBContext _context = context;

		public async Task<List<Vacation>> GetAllVacations()
		{
			try
			{
				return await _context.Vacations
					.Include(v => v.Employee)
					.Where(v => v.EmployeeId != null)
					.Include(v => v.Employee.EmpCategory)
					.OrderBy(v => v.From).ToListAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return [];
			}
		}

		public async Task<Vacation?> GetVacationById(int id)
		{
			try
			{
				return await _context.Vacations.FindAsync(id);
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return null;
			}
		}

		public async Task CreateVacation(Vacation vacation)
		{
			try
			{
				_context.Vacations.Add(vacation);
				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
			}
		}

		public async Task UpdateVacation(Vacation vacation)
		{
			try
			{
				var _vacation = await _context.Vacations.FindAsync(vacation.VacationId);

				if (_vacation == null) return;

				_vacation.VacationState = vacation.VacationState;
				_vacation.From = vacation.From;
				_vacation.To = vacation.To;
				_vacation.Note = vacation.Note;
				_vacation.EmployeeId = vacation.EmployeeId;
				_vacation.NewEmpName = vacation.NewEmpName;

				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
			}
		}

		public async Task DeleteVacation(int id)
		{
			try
			{
				var vacation = await _context.Vacations.FindAsync(id);

				if (vacation == null) return;

				_context.Vacations.Remove(vacation);
				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
			}
		}

		public async Task<Vacation?> RequestVacation(Vacation vacation)
		{
			try
			{
				if (vacation != null)
				{
					vacation.VacationState = 2;
					_context.Vacations.Add(vacation);
					await _context.SaveChangesAsync();
					return vacation;
				}
				else
				{
					return null;
				}
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return null;
			}
		}

		public async Task<List<Vacation>> GetVacationsByFilter(int[] states, int[] categories, string from = "", string to = "")
		{
			try
			{
				IQueryable<Vacation> query = _context.Vacations
					.Include(v => v.Employee)
					.Where(s => s.EmployeeId != null)
					.Include(s => s.Employee.EmpCategory);				

				if (states.Length > 0)
				{
					query = query.Where(v => states.Contains(v.VacationState));
				}

				if (categories.Length > 0)
				{
					query = query.Where(v => categories.Contains(v.Employee.EmpCategoryId));
				}

				if (!string.IsNullOrEmpty(from))
				{
					var fromDate = Extensions.DateStringToDate(from);
					query = query.Where(v => fromDate.Date <= v.To.Date);
				}

				if (!string.IsNullOrEmpty(to))
				{
					var toDate = Extensions.DateStringToDate(to);
					query = query.Where(v => toDate.Date >= v.From.Date);
				}

				return await query.OrderBy(v => v.From).ToListAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return [];
			}
		}

		private void DefaultLogMessage(Exception ex)
		{
			_logger.Log(LogLevel.Error, $"Something went wrong. Message: {ex.Message}");
		}
	}
}
