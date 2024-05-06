using SchedulerAppAPICore.Core;
using SchedulerAppAPICore.Services;

namespace SchedulerAppAPICore
{
    public static class BuilderExtensions
    {
        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddScoped<IAmbulanceService, AmbulanceService>();
            services.AddScoped<ICalEventService, CalEventService>();
            services.AddScoped<IDepartmentService, DepartmentService>();
            services.AddScoped<IEmpCategoryService, EmpCategoryService>();
            services.AddScoped<IEmployeeService, EmployeeService>();
            services.AddScoped<IShiftService, ShiftService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IVacationService, VacationService>();

            return services;
        }
    }
}
