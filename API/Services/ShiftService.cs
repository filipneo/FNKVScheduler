using Microsoft.EntityFrameworkCore;
using SchedulerAppAPICore.Core;
using SchedulerAppAPICore.Models;
using SchedulerAppAPICore.Utils;

namespace SchedulerAppAPICore.Services
{
	public class ShiftService(ILogger<ShiftService> logger, DBContext context) : IShiftService
	{
		private readonly ILogger<ShiftService> _logger = logger;
		private readonly DBContext _context = context;

		public async Task<List<Shift>> GetAllShifts()
		{
			try
			{
				return await _context.Shifts
					.Include(s => s.Employee)
					.ThenInclude(e => e.EmpCategory)
					.ToListAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return [];
			}
		}

		public async Task<Shift?> GetShiftById(int id)
		{
			try
			{
				return await _context.Shifts
					.Include(s => s.Employee)
					.ThenInclude(e => e.EmpCategory)
					.FirstOrDefaultAsync(i => i.ShiftId == id);
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return null;
			}
		}

		public async Task<Shift?> CreateShift(Shift shift)
		{
			try
			{
				_context.Shifts.Add(shift);
				await _context.SaveChangesAsync();

				var createdShift = await _context.Shifts
					.Include(s => s.Employee)
					.ThenInclude(e => e.EmpCategory)
					.FirstOrDefaultAsync(s => s.ShiftId == shift.ShiftId);

				return createdShift;
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return null;
			}
		}

		public async Task UpdateShift(Shift shift)
		{
			try
			{
				var _shift = await _context.Shifts.FindAsync(shift.ShiftId);

				if (_shift == null) return;

				_shift.EmployeeId = shift.EmployeeId;
				_shift.PartOfTheDay = shift.PartOfTheDay;
				_shift.Note = shift.Note;

				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
			}
		}

		public async Task DeleteShift(int id)
		{
			try
			{
				var shift = await _context.Shifts.FindAsync(id);

				if (shift == null) return;

				_context.Shifts.Remove(shift);
				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
			}
		}

		public async Task<bool> CopyWeek(string dateFrom, string dateTo)
		{
			try
			{
				var dtFrom = Extensions.DateStringToDate(dateFrom);
				var dtTo = Extensions.DateStringToDate(dateTo);

				var datesDif = dtTo - dtFrom;

				var nowShifts = await GetShiftsForWeek(dateTo);

				if (nowShifts.Count <= 0)
				{
					var toCopyShifts = await GetShiftsForWeek(dateFrom);

					foreach (var shift in toCopyShifts)
					{
						Shift newShift = new()
						{
							EmployeeId = shift.EmployeeId,
							AmbulanceId = shift.AmbulanceId,
							Date = shift.Date + datesDif,
							PartOfTheDay = shift.PartOfTheDay,
							Note = shift.Note
						};
						_context.Shifts.Add(newShift);
					}

					await _context.SaveChangesAsync();
					return true;
				}
				else
				{
					return false;
				}
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return false;
			}
		}

		public async Task<bool> GenFromPref(string date)
		{
			try
			{

				var dt = Extensions.DateStringToDate(date);
				var rnd = new Random();

				// Iterate over each day in the week
				for (int i = 0; i < 7; i++)
				{
					DayOfWeek dayOfWeek = dt.AddDays(i).DayOfWeek;

					// Load employees
					var employees = await _context.Employees
						.Include(e => e.PreferredAmbulances)
						.Include(e => e.FixedAmbulances)
						.Include(e => e.Vacations)
						.ToListAsync();

					// Filter out employees who are on vacation on the current day
					employees.RemoveAll(e => e.Vacations.Any(v => dt.AddDays(i) >= v.From && dt.AddDays(i) <= v.To && v.VacationState == 0));

					// Filter out employees who are not available to work on the specified day
					employees = employees.Where(e => Utils.Extensions.IsEmployeeAvailableOnDay(e, dayOfWeek)).ToList();

					// Iterate over each ambulance
					foreach (var ambulance in _context.Ambulances)
					{
						var availableEmployees = new List<Employee>(employees);

						// Filter out employees whose fixed ambulance does not match the current one
						availableEmployees.RemoveAll(e => e.FixedAmbulances.Any(fa => fa.AmbulanceId != ambulance.AmbulanceId));

						// Sort remaining employees by preference
						availableEmployees = availableEmployees
							.OrderByDescending(e => e.PreferredAmbulances.Any(pa => pa.AmbulanceId == ambulance.AmbulanceId))
							.ToList();

						// Assign shifts
						for (int j = 0; j < ambulance.OptCap && j < availableEmployees.Count; j++)
						{
							_context.Shifts.Add(new Shift
							{
								AmbulanceId = ambulance.AmbulanceId,
								Date = dt.AddDays(i),
								EmployeeId = availableEmployees[j].EmployeeId,
								PartOfTheDay = rnd.Next(0, 3),
								Note = ""
							});

							employees.Remove(availableEmployees[j]);
						}
					}
				}

				await _context.SaveChangesAsync();
				return true;

			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return false;
			}
		}

		public async Task<List<Shift>> GetShiftsByDate(string date)
		{
			try
			{
				var dt = Extensions.DateStringToDate(date);

				return await _context.Shifts.Where(shift => shift.Date == dt)
					.Include(s => s.Employee)
					.ThenInclude(e => e.EmpCategory)
					.ToListAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return [];
			}
		}

		public async Task<List<Shift>> GetShiftsForWeek(string date)
		{
			try
			{
				DateTime fromDate = Extensions.DateStringToDate(date);
				DateTime toDate = fromDate.AddDays(7);

				return await _context.Shifts.Where(shift => shift.Date <= toDate && fromDate <= shift.Date)
					.Include(s => s.Employee)
					.ThenInclude(e => e.EmpCategory)
					.ToListAsync();
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
