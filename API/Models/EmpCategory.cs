using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SchedulerAppAPICore.Models
{
	public class EmpCategory
	{
		[Key]
		public int EmpCategoryId { get; set; }

		[Required]
		[StringLength(255)]
		public string Name { get; set; }

		[Required]
		[StringLength(45)]
		public string Color { get; set; }

		// --------------------------------------------------

		[JsonIgnore]
		public List<Employee> Employees { get; } = [];	
	}
}