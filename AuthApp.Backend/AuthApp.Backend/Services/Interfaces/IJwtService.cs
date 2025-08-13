using AuthApp.Backend.Models;
using System.Security.Claims;

namespace AuthApp.Backend.Services.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
        ClaimsPrincipal? ValidateToken(string token);
    }

}
