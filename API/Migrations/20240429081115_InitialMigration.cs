using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SchedulerAppAPICore.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "CalEvents",
                columns: table => new
                {
                    CalEventId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Note = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    From = table.Column<DateTime>(type: "date", nullable: false),
                    To = table.Column<DateTime>(type: "date", nullable: false),
                    Color = table.Column<string>(type: "varchar(45)", unicode: false, maxLength: 45, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CalEvents", x => x.CalEventId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "EmpCategories",
                columns: table => new
                {
                    EmpCategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Color = table.Column<string>(type: "varchar(45)", unicode: false, maxLength: 45, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmpCategories", x => x.EmpCategoryId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Username = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Password = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    EmployeeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    FirstName = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastName = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Phone = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    NameCode = table.Column<string>(type: "varchar(6)", unicode: false, maxLength: 6, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EmpCategoryId = table.Column<int>(type: "int", nullable: false),
                    FromLimit = table.Column<DateTime>(type: "date", nullable: true),
                    ToLimit = table.Column<DateTime>(type: "date", nullable: true),
                    PreferredAmbulanceIds = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FixedAmbulanceIds = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FixedDays = table.Column<string>(type: "varchar(60)", maxLength: 60, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.EmployeeId);
                    table.ForeignKey(
                        name: "FK_Employees_EmpCategories_EmpCategoryId",
                        column: x => x.EmpCategoryId,
                        principalTable: "EmpCategories",
                        principalColumn: "EmpCategoryId",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Departments",
                columns: table => new
                {
                    DepartmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MinCap = table.Column<int>(type: "int", nullable: true),
                    OptCap = table.Column<int>(type: "int", nullable: true),
                    MaxCap = table.Column<int>(type: "int", nullable: true),
                    HeadEmpId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.DepartmentId);
                    table.ForeignKey(
                        name: "FK_Departments_Employees_HeadEmpId",
                        column: x => x.HeadEmpId,
                        principalTable: "Employees",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Vacations",
                columns: table => new
                {
                    VacationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    From = table.Column<DateTime>(type: "date", nullable: false),
                    To = table.Column<DateTime>(type: "date", nullable: false),
                    VacationState = table.Column<int>(type: "int", nullable: false),
                    Note = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EmployeeId = table.Column<int>(type: "int", nullable: true),
                    NewEmpName = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vacations", x => x.VacationId);
                    table.ForeignKey(
                        name: "FK_Vacations_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Ambulances",
                columns: table => new
                {
                    AmbulanceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DepartmentId = table.Column<int>(type: "int", nullable: false),
                    MinCap = table.Column<int>(type: "int", nullable: false),
                    OptCap = table.Column<int>(type: "int", nullable: false),
                    MaxCap = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ambulances", x => x.AmbulanceId);
                    table.ForeignKey(
                        name: "FK_Ambulances_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "DepartmentId",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "fixed_ambulance",
                columns: table => new
                {
                    FixedAmbulancesAmbulanceId = table.Column<int>(type: "int", nullable: false),
                    FixedEmployeesEmployeeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fixed_ambulance", x => new { x.FixedAmbulancesAmbulanceId, x.FixedEmployeesEmployeeId });
                    table.ForeignKey(
                        name: "FK_fixed_ambulance_Ambulances_FixedAmbulancesAmbulanceId",
                        column: x => x.FixedAmbulancesAmbulanceId,
                        principalTable: "Ambulances",
                        principalColumn: "AmbulanceId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_fixed_ambulance_Employees_FixedEmployeesEmployeeId",
                        column: x => x.FixedEmployeesEmployeeId,
                        principalTable: "Employees",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "preferred_ambulance",
                columns: table => new
                {
                    PreferredAmbulancesAmbulanceId = table.Column<int>(type: "int", nullable: false),
                    PreferredEmployeesEmployeeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_preferred_ambulance", x => new { x.PreferredAmbulancesAmbulanceId, x.PreferredEmployeesEmployeeId });
                    table.ForeignKey(
                        name: "FK_preferred_ambulance_Ambulances_PreferredAmbulancesAmbulanceId",
                        column: x => x.PreferredAmbulancesAmbulanceId,
                        principalTable: "Ambulances",
                        principalColumn: "AmbulanceId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_preferred_ambulance_Employees_PreferredEmployeesEmployeeId",
                        column: x => x.PreferredEmployeesEmployeeId,
                        principalTable: "Employees",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Shifts",
                columns: table => new
                {
                    ShiftId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    PartOfTheDay = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "date", nullable: false),
                    Note = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    AmbulanceId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shifts", x => x.ShiftId);
                    table.ForeignKey(
                        name: "FK_Shifts_Ambulances_AmbulanceId",
                        column: x => x.AmbulanceId,
                        principalTable: "Ambulances",
                        principalColumn: "AmbulanceId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Shifts_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "EmpCategories",
                columns: new[] { "EmpCategoryId", "Color", "Name" },
                values: new object[] { 1, "#0e7d01", "Doktor" });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "Password", "Username" },
                values: new object[] { 1, "8C6976E5B5410415BDE908BD4DEE15DFB167A9C873FC4BB8A81F6F2AB448A918", "admin" });

            migrationBuilder.InsertData(
                table: "Employees",
                columns: new[] { "EmployeeId", "Email", "EmpCategoryId", "FirstName", "FixedAmbulanceIds", "FixedDays", "FromLimit", "LastName", "NameCode", "Phone", "PreferredAmbulanceIds", "ToLimit" },
                values: new object[,]
                {
                    { 1, "john.smith@example.com", 1, "John", "[]", null, null, "Smith", "JS", "123456789", "[]", null },
                    { 2, "emma.johnson@example.com", 1, "Emma", "[]", null, null, "Johnson", "EJ", "123456789", "[]", null },
                    { 3, "michael.williams@example.com", 1, "Michael", "[]", null, null, "Williams", "MW", "123456789", "[]", null },
                    { 4, "sarah.brown@example.com", 1, "Sarah", "[]", null, null, "Brown", "SB", "123456789", "[]", null },
                    { 5, "james.jones@example.com", 1, "James", "[]", null, null, "Jones", "JJ", "123456789", "[]", null },
                    { 6, "jennifer.davis@example.com", 1, "Jennifer", "[]", null, null, "Davis", "JD", "123456789", "[]", null },
                    { 7, "david.miller@example.com", 1, "David", "[]", null, null, "Miller", "DM", "123456789", "[]", null },
                    { 8, "jessica.wilson@example.com", 1, "Jessica", "[]", null, null, "Wilson", "JW", "123456789", "[]", null },
                    { 9, "daniel.taylor@example.com", 1, "Daniel", "[]", null, null, "Taylor", "DT", "123456789", "[]", null },
                    { 10, "emily.clark@example.com", 1, "Emily", "[]", null, null, "Clark", "EC", "123456789", "[]", null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ambulances_DepartmentId",
                table: "Ambulances",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Departments_HeadEmpId",
                table: "Departments",
                column: "HeadEmpId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_EmpCategoryId",
                table: "Employees",
                column: "EmpCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_fixed_ambulance_FixedEmployeesEmployeeId",
                table: "fixed_ambulance",
                column: "FixedEmployeesEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_preferred_ambulance_PreferredEmployeesEmployeeId",
                table: "preferred_ambulance",
                column: "PreferredEmployeesEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Shifts_AmbulanceId",
                table: "Shifts",
                column: "AmbulanceId");

            migrationBuilder.CreateIndex(
                name: "IX_Shifts_EmployeeId",
                table: "Shifts",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Vacations_EmployeeId",
                table: "Vacations",
                column: "EmployeeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CalEvents");

            migrationBuilder.DropTable(
                name: "fixed_ambulance");

            migrationBuilder.DropTable(
                name: "preferred_ambulance");

            migrationBuilder.DropTable(
                name: "Shifts");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Vacations");

            migrationBuilder.DropTable(
                name: "Ambulances");

            migrationBuilder.DropTable(
                name: "Departments");

            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "EmpCategories");
        }
    }
}
