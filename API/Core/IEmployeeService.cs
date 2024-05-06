using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore.Core
{
	public interface IEmployeeService
	{
		Task<List<Employee>> GetAllEmployees();
		Task<Employee?> GetEmployeeById(int id);
		Task CreateEmployee(Employee employee);
		Task UpdateEmployee(Employee updatedEmployee);
		Task DeleteEmployee(int id);
		Task<List<Employee>> GetFreeEmployeesForDate(string date);
		Task<List<Employee>> GetEmployeesByCategory(int[] categories);
	}
}