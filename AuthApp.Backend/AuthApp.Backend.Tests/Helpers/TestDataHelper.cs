using AuthApp.Backend.Models;
using AuthApp.Backend.Models.DTOs;

namespace AuthApp.Backend.Tests.Helpers
{
    public static class TestDataHelper
    {
        public static User CreateTestUser(string email = "test@example.com", string password = "password123")
        {
            return new User
            {
                Id = Guid.NewGuid(),
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
            };
        }

        public static RegisterRequest CreateRegisterRequest(string email = "test@example.com", string password = "password123")
        {
            return new RegisterRequest(email, password);
        }

        public static LoginRequest CreateLoginRequest(string email = "test@example.com", string password = "password123")
        {
            return new LoginRequest(email, password);
        }

        public static string GenerateRandomEmail()
        {
            return $"test{Guid.NewGuid().ToString("N")[..8]}@example.com";
        }

        public static string GenerateStrongPassword()
        {
            return "StrongP@ssw0rd123!";
        }
    }
}