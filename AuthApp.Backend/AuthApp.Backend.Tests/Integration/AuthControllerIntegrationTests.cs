using AuthApp.Backend.Models.DTOs;
using AuthApp.Backend.Tests.Fixtures;
using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace AuthApp.Backend.Tests.Integration
{
    public class AuthControllerIntegrationTests
    {
        [Fact]
        public async Task Register_ValidRequest_ReturnsOk()
        {
            using var factory = new TestWebApplicationFactory<Program>();
            using var client = factory.CreateClient();
            var request = new RegisterRequest($"test{Guid.NewGuid():N}@example.com", "password123");

            var response = await client.PostAsJsonAsync("/api/auth/register", request);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task Login_ValidCredentials_ReturnsOk()
        {
            using var factory = new TestWebApplicationFactory<Program>();
            using var client = factory.CreateClient();
            
            var email = $"login{Guid.NewGuid():N}@example.com";
            var password = "password123";
            
            var registerRequest = new RegisterRequest(email, password);
            await client.PostAsJsonAsync("/api/auth/register", registerRequest);
            
            var loginRequest = new LoginRequest(email, password);
            var response = await client.PostAsJsonAsync("/api/auth/login", loginRequest);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}