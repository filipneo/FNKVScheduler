using Microsoft.EntityFrameworkCore;
using SchedulerAppAPICore.Core;
using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore.Services
{
	public class DepartmentService(ILogger<DepartmentService> logger, DBContext context) : IDepartmentService
	{
		private readonly ILogger<DepartmentService> _logger = logger;
		private readonly DBContext _context = context;

		public async Task<List<Department>> GetAllDepartments()
		{
			try
			{
				return await _context.Departments.ToListAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return [];
			}
		}

		public async Task<List<Department>> GetAllDepartmentsWithAmbulances()
		{
			try
			{
				return await _context.Departments
					.Include(d => d.Ambulances)
					.Include(d => d.HeadEmpId)
					.ToListAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return [];
			}
		}

		public async Task<Department?> GetDepartmentById(int id)
		{
			try
			{
				return await _context.Departments.FindAsync(id);
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return null;
			}
		}

		public async Task CreateDepartment(Department department)
		{
			try
			{
				_context.Departments.Add(department);
				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
			}
		}

		public async Task UpdateDepartment(Department department)
		{
			try
			{
				var _department = await _context.Departments.FindAsync(department.DepartmentId);

				if (_department == null) return;

				_department.Name = department.Name;
				_department.HeadEmpId = department.HeadEmpId;
				_department.MinCap = department.MinCap;
				_department.OptCap = department.OptCap;
				_department.MaxCap = department.MaxCap;

				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
			}
		}

		public async Task DeleteDepartment(int id)
		{
			try
			{
				var department = await _context.Departments.FindAsync(id);

				if (department == null) return;

				_context.Departments.Remove(department);
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
