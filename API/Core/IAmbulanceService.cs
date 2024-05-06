using SchedulerAppAPICore.Models;

namespace SchedulerAppAPICore.Core
{
    public interface IAmbulanceService
    {
        Task<List<Ambulance>> GetAllAmbulances();
        Task<Ambulance?> GetAmbulanceById(int id);
        Task CreateAmbulance(Ambulance ambulance);
        Task UpdateAmbulance(Ambulance ambulance);
        Task DeleteAmbulance(int id);
    }
}
