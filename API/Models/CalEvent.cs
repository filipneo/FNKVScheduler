using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SchedulerAppAPICore.Models
{
	public class CalEvent
	{
		[Key]
		public int CalEventId { get; set; }

		[Required]
		[StringLength(255)]
		public string Name { get; set; }

		[StringLength(255)]
		public string? Note { get; set; }

		[Required]
		[Column(TypeName = "date")]
		public DateTime From { get; set; }

		[Required]
		[Column(TypeName = "date")]
		public DateTime To { get; set; }

		[StringLength(45)]
		public string Color { get; set; }
	}
}