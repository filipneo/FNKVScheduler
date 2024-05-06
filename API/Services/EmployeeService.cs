using Microsoft.EntityFrameworkCore;
using SchedulerAppAPICore.Core;
using SchedulerAppAPICore.Models;
using SchedulerAppAPICore.Utils;

namespace SchedulerAppAPICore.Services
{
	public class EmployeeService(ILogger<EmployeeService> logger, DBContext context) : IEmployeeService
	{
		private readonly ILogger<EmployeeService> _logger = logger;
		private readonly DBContext _context = context;

		public async Task<List<Employee>> GetAllEmployees()
		{
			try
			{

				var employees = await _context.Employees
					.Include(e => e.EmpCategory)
					.OrderBy(e => e.FirstName)
					.ToListAsync();

				// Load preferred ambulance IDs
				foreach (var employee in employees)
				{
					var preferredAmbulanceIds = await _context.Entry(employee)
						.Collection(e => e.PreferredAmbulances)
						.Query()
						.Select(a => a.AmbulanceId)
						.ToListAsync();

					employee.PreferredAmbulanceIds = preferredAmbulanceIds;
				}

				// Load fixed ambulance IDs
				foreach (var employee in employees)
				{
					var fixedAmbulanceIds = await _context.Entry(employee)
						.Collection(e => e.FixedAmbulances)
						.Query()
						.Select(a => a.AmbulanceId)
						.ToListAsync();

					employee.FixedAmbulanceIds = fixedAmbulanceIds;
				}

				return employees;

			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return [];
			}
		}


		public async Task<Employee?> GetEmployeeById(int id)
		{
			try
			{
				return await _context.Employees
					.Include(e => e.EmpCategory)
					.Include(e => e.PreferredAmbulances)
					.Include(e => e.FixedAmbulances)
					.FirstOrDefaultAsync(e => e.EmployeeId == id);
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return null;
			}
		}

		public async Task CreateEmployee(Employee employee)
		{
			try
			{
				if (employee == null) return;

				if (employee.PreferredAmbulanceIds != null && employee.PreferredAmbulanceIds.Count != 0)
				{
					employee.PreferredAmbulances = await _context.Ambulances.Where(a => employee.PreferredAmbulanceIds.Contains(a.AmbulanceId)).ToListAsync();
				}

				if (employee.FixedAmbulanceIds != null && employee.FixedAmbulanceIds.Count != 0)
				{
					employee.FixedAmbulances = await _context.Ambulances.Where(a => employee.FixedAmbulanceIds.Contains(a.AmbulanceId)).ToListAsync();
				}

				_context.Employees.Add(employee);
				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
			}
		}


		public async Task UpdateEmployee(Employee employee)
		{
			try
			{
				if (employee == null) return;

				var _employee = await _context.Employees
					.Include(e => e.PreferredAmbulances)
					.Include(e => e.FixedAmbulances)
					.SingleOrDefaultAsync(e => e.EmployeeId == employee.EmployeeId);

				if (_employee != null)
				{

					// Update employee properties
					_employee.FirstName = employee.FirstName;
					_employee.LastName = employee.LastName;
					_employee.Phone = employee.Phone;
					_employee.Email = employee.Email;
					_employee.NameCode = employee.NameCode;
					_employee.EmpCategoryId = employee.EmpCategoryId;
					_employee.FixedDays = employee.FixedDays;
					_employee.FromLimit = employee.FromLimit;
					_employee.ToLimit = employee.ToLimit;

					// Update preferred ambulances
					_employee.PreferredAmbulances.Clear();
					if (employee.PreferredAmbulanceIds != null && employee.PreferredAmbulanceIds.Any())
					{
						var preferredAmbulances = await _context.Ambulances.Where(a => employee.PreferredAmbulanceIds.Contains(a.AmbulanceId)).ToListAsync();
						_employee.PreferredAmbulances.AddRange(preferredAmbulances);
					}

					// Update fixed ambulances
					_employee.FixedAmbulances.Clear();
					if (employee.FixedAmbulanceIds != null && employee.FixedAmbulanceIds.Any())
					{
						var fixedAmbulances = await _context.Ambulances.Where(a => employee.FixedAmbulanceIds.Contains(a.AmbulanceId)).ToListAsync();
						_employee.FixedAmbulances.AddRange(fixedAmbulances);
					}

					await _context.SaveChangesAsync();
				}
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
			}
		}

		public async Task DeleteEmployee(int id)
		{
			try
			{
				var employee = await _context.Employees.FindAsync(id);

				if (employee == null) return;

				_context.Employees.Remove(employee);
				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
			}
		}

		public async Task<List<Employee>> GetFreeEmployeesForDate(string date)
		{
			try
			{
				var findDate = Extensions.DateStringToDate(date);
				DayOfWeek dayOfWeek = findDate.DayOfWeek;

				// Load employees with EmpCategory and Vacations asynchronously
				var employees = await _context.Employees
					.Include(e => e.EmpCategory)
					.Include(e => e.Vacations)
					.OrderBy(e => e.FirstName)
					.ToListAsync();

				// Load fixed ambulance IDs for each employee
				foreach (var employee in employees)
				{
					var fixedAmbulanceIds = await _context.Entry(employee)
													.Collection(e => e.FixedAmbulances)
													.Query()
													.Select(a => a.AmbulanceId)
													.ToListAsync();

					employee.FixedAmbulanceIds = fixedAmbulanceIds;
				}

				// Load shifts for the date asynchronously
				var shifts = await _context.Shifts.Where(s => s.Date == findDate.Date).ToListAsync();

				// Remove employees with shifts
				foreach (Shift shift in shifts)
				{
					employees.RemoveAll(e => e.EmployeeId == shift.EmployeeId);
				}

				// Filter out employees with approved vacations that overlap with the specified date
				employees.RemoveAll(e => e.Vacations.Any(v => findDate >= v.From && findDate <= v.To && v.VacationState == 0));

				// Filter out employees whose employment period does not include the specified date
				employees.RemoveAll(e => (e.FromLimit != null && findDate < e.FromLimit) || (e.ToLimit != null && findDate > e.ToLimit));

				// Filter out employees who are not available to work on the specified day
				employees = employees.Where(e => Utils.Extensions.IsEmployeeAvailableOnDay(e, dayOfWeek)).ToList();

				return employees;

			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return [];
			}
		}


		public async Task<List<Employee>> GetEmployeesByCategory(int[] categories)
		{
			throw new NotImplementedException();
		}

		private void DefaultLogMessage(Exception ex)
		{
			_logger.Log(LogLevel.Error, $"Something went wrong. Message: {ex.Message}");
		}
	}
}
