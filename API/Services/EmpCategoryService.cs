using Microsoft.EntityFrameworkCore;
using SchedulerAppAPICore.Core;
using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore.Services
{
	public class EmpCategoryService(ILogger<EmpCategoryService> logger, DBContext context) : IEmpCategoryService
	{
		private readonly ILogger<EmpCategoryService> _logger = logger;
		private readonly DBContext _context = context;

		public async Task<List<EmpCategory>> GetAllEmpCategories()
		{
			try
			{
				return await _context.EmpCategories.ToListAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return [];
			}
		}

		public async Task<EmpCategory?> GetEmpCategoryById(int id)
		{
			try
			{
				return await _context.EmpCategories.FindAsync(id);
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
				return null;
			}
		}

		public async Task CreateEmpCategory(EmpCategory empcategory)
		{
			try
			{
				_context.EmpCategories.Add(empcategory);
				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
			}
		}

		public async Task UpdateEmpCategory(EmpCategory empCategory)
		{
			try
			{
				var _empCatetegory = await _context.EmpCategories.FindAsync(empCategory.EmpCategoryId);

				if (_empCatetegory == null) return;

				_empCatetegory.Name = empCategory.Name;
				_empCatetegory.Color = empCategory.Color;

				await _context.SaveChangesAsync();
			}
			catch (Exception ex)
			{
				DefaultLogMessage(ex);
			}
		}

		public async Task DeleteEmpCategory(int id)
		{
			try
			{
				var empCategory = await _context.EmpCategories.FindAsync(id);

				if (empCategory == null) return;

				_context.EmpCategories.Remove(empCategory);
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
