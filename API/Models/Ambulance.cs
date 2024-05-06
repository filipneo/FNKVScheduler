using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SchedulerAppAPICore.Models
{
    public class Ambulance
    {
        [Key]
        public int AmbulanceId { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [Required]
		public int DepartmentId { get; set; }

        [Required]
        public int MinCap { get; set; }

        [Required]
        public int OptCap { get; set; }

        [Required]
        public int MaxCap { get; set; }

        // --------------------------------------------------

        [JsonIgnore]
        public Department? Department { get; set; }

        [JsonIgnore]
        public List<Shift> Shifts { get; set; } = [];

        [JsonIgnore]
        public List<Employee> PreferredEmployees { get; set; } = [];

        [JsonIgnore]
		public List<Employee> FixedEmployees { get; set; } = [];
	}
}