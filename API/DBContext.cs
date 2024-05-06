using Microsoft.EntityFrameworkCore;
using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore
{
	public class DBContext(DbContextOptions<DBContext> options) : DbContext(options)
	{
		public DbSet<Ambulance> Ambulances { get; set; }
		public DbSet<Department> Departments { get; set; }
		public DbSet<CalEvent> CalEvents { get; set; }
		public DbSet<EmpCategory> EmpCategories { get; set; }
		public DbSet<Employee> Employees { get; set; }
		public DbSet<User> Users { get; set; }
		public DbSet<Shift> Shifts { get; set; }
		public DbSet<Vacation> Vacations { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			//.......................................................
			// Ambulance

			modelBuilder.Entity<Ambulance>()
				.Property(e => e.Name)
				.IsUnicode(false);

			modelBuilder.Entity<Ambulance>()
				.HasMany(e => e.Shifts)
				.WithOne(e => e.Ambulance)
				.HasForeignKey(e => e.AmbulanceId)
				.IsRequired()
				.OnDelete(DeleteBehavior.Restrict);

			//.......................................................
			// CalEvent

			modelBuilder.Entity<CalEvent>()
				.Property(e => e.Name)
				.IsUnicode(false);

			modelBuilder.Entity<CalEvent>()
				.Property(e => e.Note)
				.IsUnicode(false);

			modelBuilder.Entity<CalEvent>()
				.Property(e => e.Color)
				.IsUnicode(false);

			//.......................................................
			// Department

			modelBuilder.Entity<Department>()
				.Property(e => e.Name)
				.IsUnicode(false);

			modelBuilder.Entity<Department>()
				.HasMany(e => e.Ambulances)
				.WithOne(e => e.Department)
				.HasForeignKey(e => e.DepartmentId)
				.IsRequired()
				.OnDelete(DeleteBehavior.Restrict);

			//.......................................................
			// EmpCategory

			modelBuilder.Entity<EmpCategory>()
				.Property(e => e.Name)
				.IsUnicode(false);

			modelBuilder.Entity<EmpCategory>()
				.Property(e => e.Color)
				.IsUnicode(false);

			modelBuilder.Entity<EmpCategory>()
				.HasMany(e => e.Employees)
				.WithOne(e => e.EmpCategory)
				.HasForeignKey(e => e.EmpCategoryId)
				.IsRequired()
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<EmpCategory>().HasData(
				new EmpCategory
				{
					EmpCategoryId = 1,
					Name = "Doktor",
					Color = "#0e7d01"
				}
			);

			//.......................................................
			// Employee

			modelBuilder.Entity<Employee>()
				.Property(e => e.FirstName)
				.IsUnicode(false);

			modelBuilder.Entity<Employee>()
				.Property(e => e.LastName)
				.IsUnicode(false);

			modelBuilder.Entity<Employee>()
				.Property(e => e.Phone)
				.IsUnicode(false);

			modelBuilder.Entity<Employee>()
				.Property(e => e.Email)
				.IsUnicode(false);

			modelBuilder.Entity<Employee>()
				.Property(e => e.NameCode)
				.IsUnicode(false);

			modelBuilder.Entity<Employee>()
				.HasMany(e => e.HeadOfDepartments)
				.WithOne(e => e.HeadEmployee)
				.HasForeignKey(e => e.HeadEmpId)
				.IsRequired(false)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Employee>()
				.HasMany(e => e.Shifts)
				.WithOne(e => e.Employee)
				.HasForeignKey(e => e.EmployeeId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Employee>()
				.HasMany(e => e.Vacations)
				.WithOne(e => e.Employee)
				.HasForeignKey(e => e.EmployeeId)
				.OnDelete(DeleteBehavior.Restrict);

			modelBuilder.Entity<Employee>()
				.HasMany(e => e.PreferredAmbulances)
				.WithMany(e => e.PreferredEmployees)
				.UsingEntity("preferred_ambulance");

			modelBuilder.Entity<Employee>()
				.HasMany(e => e.FixedAmbulances)
				.WithMany(e => e.FixedEmployees)
				.UsingEntity("fixed_ambulance");

			var employeeNames = new List<string> { "John Smith", "Emma Johnson", "Michael Williams", "Sarah Brown", "James Jones", "Jennifer Davis", "David Miller", "Jessica Wilson", "Daniel Taylor", "Emily Clark" };

			var employees = new List<Employee>();

			int id = 1;

			foreach (var name in employeeNames)
			{
				var fullName = name.Split(' ');
				var firstName = fullName[0];
				var lastName = fullName[1];

				var newEmployee = new Employee
				{
					EmployeeId = id,
					FirstName = firstName,
					LastName = lastName,
					Email = $"{firstName.ToLower()}.{lastName.ToLower()}@example.com",
					Phone = "123456789",
					EmpCategoryId = 1,
					NameCode = $"{firstName.Substring(0, 1)}{lastName.Substring(0, 1)}"
				};

				employees.Add(newEmployee);
				id++;
			}

			modelBuilder.Entity<Employee>().HasData(employees);

			//.......................................................
			// Shift

			modelBuilder.Entity<Shift>()
				.Property(e => e.Note)
				.IsUnicode(false);

			//.......................................................
			// User

			modelBuilder.Entity<User>()
				.Property(e => e.Username)
				.IsUnicode(false);

			modelBuilder.Entity<User>()
				.Property(e => e.Password)
				.IsUnicode(false);

			modelBuilder.Entity<User>().HasData(
				new User
				{
					UserId = 1,
					Username = "admin",
					Password = "8C6976E5B5410415BDE908BD4DEE15DFB167A9C873FC4BB8A81F6F2AB448A918"
				}
			);

			//.......................................................
			// Vacation

			modelBuilder.Entity<Vacation>()
				.Property(e => e.Note)
				.IsUnicode(false);
		}
	}
}