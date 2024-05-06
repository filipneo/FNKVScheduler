using Microsoft.EntityFrameworkCore;
using SchedulerAppAPICore.Core;
using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore.Services
{
    public class AmbulanceService(ILogger<AmbulanceService> logger, DBContext context) : IAmbulanceService
    {
        private readonly ILogger<AmbulanceService> _logger = logger;
        private readonly DBContext _context = context;

        public async Task<List<Ambulance>> GetAllAmbulances()
        {
            try
            {
                return await _context.Ambulances.ToListAsync();
            }
            catch (Exception ex)
            {
                DefaultLogMessage(ex);
                return [];
            }
        }

        public async Task<Ambulance?> GetAmbulanceById(int id)
        {
            try
            {
                return await _context.Ambulances.FindAsync(id);
            }
            catch (Exception ex)
            {
                DefaultLogMessage(ex);
                return null;
            }
        }

        public async Task CreateAmbulance(Ambulance ambulance)
        {
            try
            {
                _context.Ambulances.Add(ambulance);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                DefaultLogMessage(ex);
            }
        }

        public async Task UpdateAmbulance(Ambulance ambulance)
        {
            try
            {
                var _ambulance = await _context.Ambulances.FindAsync(ambulance.AmbulanceId);

                if (_ambulance == null)
                    return;

                _ambulance.Name = ambulance.Name;
                _ambulance.OptCap = ambulance.OptCap;
                _ambulance.MinCap = ambulance.MinCap;
                _ambulance.MaxCap = ambulance.MaxCap;

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                DefaultLogMessage(ex);
            }
        }

        public async Task DeleteAmbulance(int id)
        {
            try
            {
                var ambulance = await _context.Ambulances.FindAsync(id);

                if (ambulance == null)
                    return;

                _context.Ambulances.Remove(ambulance);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                DefaultLogMessage(ex);
            }
        }

        private void DefaultLogMessage(Exception ex)
        {
            _logger.Log(LogLevel.Error, $"Something went wrong. Message: {ex.Message}");
        }
	}
}
