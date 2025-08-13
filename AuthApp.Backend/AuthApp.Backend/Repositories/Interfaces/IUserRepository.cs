using AuthApp.Backend.Models;

namespace AuthApp.Backend.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task AddUserAsync(User user);
        Task<bool> EmailExistsAsync(string email);
    }
}
