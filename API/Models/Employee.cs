using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SchedulerAppAPICore.Models
{
	public class Employee
	{
		[Key]
		public int EmployeeId { get; set; }

		[Required]
		[StringLength(255)]
		public string FirstName { get; set; }

		[Required]
		[StringLength(255)]
		public string LastName { get; set; }

		[Required]
		[StringLength(255)]
		public string Phone { get; set; }

		[Required]
		[StringLength(255)]
		public string Email { get; set; }

		[Required]
		[StringLength(6)]
		public string NameCode { get; set; }

		[Required]
		public int EmpCategoryId { get; set; }

		[Column(TypeName = "date")]
		public DateTime? FromLimit { get; set; }

		[Column(TypeName = "date")]
		public DateTime? ToLimit { get; set; }

		[JsonPropertyName("preferredAmbIds")]
		public List<int> PreferredAmbulanceIds { get; set; } = [];

		[JsonPropertyName("fixedAmbIds")]
		public List<int> FixedAmbulanceIds { get; set; } = [];

		[StringLength(60)]
		public string? FixedDays { get; set; }

		// --------------------------------------------------

		[JsonIgnore]
		public List<Ambulance> PreferredAmbulances { get; set; } = [];

		[JsonIgnore]
		public List<Ambulance> FixedAmbulances { get; set; } = [];

		public EmpCategory? EmpCategory { get; set; }

		[JsonIgnore]
		public List<Shift> Shifts { get; set; } = [];

		[JsonIgnore]
		public List<Vacation> Vacations { get; set; } = [];

		[JsonIgnore]
		public List<Department> HeadOfDepartments { get; set; } = [];
	}
}
