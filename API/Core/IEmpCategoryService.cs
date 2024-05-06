using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore.Core
{
	public interface IEmpCategoryService
	{
		Task<List<EmpCategory>> GetAllEmpCategories();
		Task<EmpCategory?> GetEmpCategoryById(int id);
		Task CreateEmpCategory(EmpCategory empcategory);
		Task UpdateEmpCategory(EmpCategory updatedEmpCategory);
		Task DeleteEmpCategory(int id);
	}
}