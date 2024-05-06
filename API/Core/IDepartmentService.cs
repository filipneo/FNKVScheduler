using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore.Core
{
	public interface IDepartmentService
	{
		Task<List<Department>> GetAllDepartments();
		Task<Department?> GetDepartmentById(int id);
		Task CreateDepartment(Department department);
		Task UpdateDepartment(Department department);
		Task DeleteDepartment(int id);
		Task<List<Department>> GetAllDepartmentsWithAmbulances();
	}
}