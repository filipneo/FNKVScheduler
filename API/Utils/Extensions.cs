using SchedulerAppAPICore.Models;
using System.Security.Cryptography;
using System.Text;

namespace SchedulerAppAPICore.Utils
{
	public static class Extensions
	{
		public static string Hash(this string source)
		{
			byte[] sourceBytes = Encoding.UTF8.GetBytes(source);
			byte[] hashBytes = SHA256.HashData(sourceBytes);
			string hash = BitConverter.ToString(hashBytes).Replace("-", String.Empty);

			return hash;
		}

		public static DateTime DateStringToDate(string stringDate)
		{
			string[] parts = stringDate.Split('-');
			DateTime date = new(Int32.Parse(parts[0]), Int32.Parse(parts[1]), Int32.Parse(parts[2]));
			return date;
		}

		public static bool IsEmployeeAvailableOnDay(Employee employee, DayOfWeek dayOfWeek)
		{
			if (employee.FixedDays == null)
			{
				// If FixedDays is null, employee is available every day
				return true;
			}
			else
			{
				string[] fixedDays = employee.FixedDays.Split(',');
				string dayName = Enum.GetName(typeof(DayOfWeek), dayOfWeek);
				return fixedDays.Contains(dayName.ToLower());
			}
		}
	}
}
