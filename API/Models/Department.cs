using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SchedulerAppAPICore.Models
{
    public class Department
    {
        [Key]
        public int DepartmentId { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; }
        
        public int? MinCap { get; set; }

        public int? OptCap { get; set; }

        public int? MaxCap { get; set; }

        public int? HeadEmpId { get; set; }

        // --------------------------------------------------

        [JsonIgnore]
        public List<Ambulance> Ambulances { get; } = [];

        [JsonIgnore]
        public Employee? HeadEmployee { get; set; }
    }
}
