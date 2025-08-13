using AuthApp.Backend.Models.DTOs;
using LoginRequest = AuthApp.Backend.Models.DTOs.LoginRequest;
using RegisterRequest = AuthApp.Backend.Models.DTOs.RegisterRequest;

namespace AuthApp.Backend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterRequest req);
        Task<LoginResponse> LoginAsync(LoginRequest req);

    }
}
