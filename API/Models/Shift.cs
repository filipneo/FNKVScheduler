using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SchedulerAppAPICore.Models
{
	public class Shift
	{
		[Key]
		public int ShiftId { get; set; }

		[Required]
		public int PartOfTheDay { get; set; }

		[Required]
		[Column(TypeName = "date")]
		public DateTime Date { get; set; }

		[StringLength(500)]
		public string? Note { get; set; }

		[Required]
		public int EmployeeId { get; set; }

		[Required]
		public int AmbulanceId { get; set; }

		// --------------------------------------------------

		[JsonIgnore]
		public Ambulance? Ambulance { get; set; }

		public Employee? Employee { get; set; }
	}
}