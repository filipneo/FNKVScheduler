using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SchedulerAppAPICore.Models
{
	public class User
	{
		[Key]
		public int UserId { get; set; }

		[Required]
		[StringLength(255)]
		public string Username { get; set; }

		[Required]
		[StringLength(255)]
		[JsonIgnore]
		public string Password { get; set; }
	}
}