using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SchedulerAppAPICore.Models
{
	public class Vacation
	{
		[Key]
		public int VacationId { get; set; }

		[Required]
		[Column(TypeName = "date")]
		public DateTime From { get; set; }

		[Required]
		[Column(TypeName = "date")]
		public DateTime To { get; set; }

		[Required]
		public int VacationState { get; set; }

		[StringLength(500)]
		public string? Note { get; set; }

		public int? EmployeeId { get; set; }

		[StringLength(255)]
		public string? NewEmpName { get; set; }

		// --------------------------------------------------

		public Employee? Employee { get; set; }
	}
}