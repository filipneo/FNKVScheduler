using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using SchedulerAppAPICore;
using SchedulerAppAPICore.Utils;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication("BasicAuthentication")
	.AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);

// Add database connection
var connectionString = builder.Configuration.GetConnectionString("MySql");

builder.Services.AddDbContext<DBContext>(options
	=> options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddServices();

builder.Services.AddControllers().AddJsonOptions(x =>
	x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(builder => builder
				.AllowAnyOrigin()
				.AllowAnyMethod()
				.AllowAnyHeader());

app.UseAuthorization();

app.MapControllers();

app.Run();
