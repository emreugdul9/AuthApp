using AuthApp.Backend.Models;
using AuthApp.Backend.Models.DTOs;
using AuthApp.Backend.Repositories.Interfaces;
using AuthApp.Backend.Services;
using AuthApp.Backend.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;

namespace AuthApp.Backend.Tests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IUserRepository> _mockUserRepository;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly Mock<IJwtService> _mockJwtService;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            _mockUserRepository = new Mock<IUserRepository>();
            _mockConfiguration = new Mock<IConfiguration>();
            _mockJwtService = new Mock<IJwtService>();
            
            _authService = new AuthService(_mockUserRepository.Object, _mockConfiguration.Object, _mockJwtService.Object);
        }

        [Fact]
        public async Task RegisterAsync_NewEmail_ReturnsSuccess()
        {
            var request = new RegisterRequest("test@example.com", "password123");

            _mockUserRepository.Setup(x => x.EmailExistsAsync(request.Email))
                .ReturnsAsync(false);
            _mockUserRepository.Setup(x => x.AddUserAsync(It.IsAny<User>()))
                .Returns(Task.CompletedTask);

            var result = await _authService.RegisterAsync(request);

            Assert.Equal("User registered successfully.", result);
        }

        [Fact]
        public async Task RegisterAsync_ExistingEmail_ThrowsException()
        {
            var request = new RegisterRequest("existing@example.com", "password123");

            _mockUserRepository.Setup(x => x.EmailExistsAsync(request.Email))
                .ReturnsAsync(true);

            await Assert.ThrowsAsync<InvalidOperationException>(
                () => _authService.RegisterAsync(request));
        }

        [Fact]
        public async Task LoginAsync_ValidCredentials_ReturnsToken()
        {
            var request = new LoginRequest("test@example.com", "password123");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            var expectedToken = "jwt-token";

            _mockUserRepository.Setup(x => x.GetByEmailAsync(request.Email))
                .ReturnsAsync(user);
            _mockJwtService.Setup(x => x.GenerateToken(user))
                .Returns(expectedToken);

            var result = await _authService.LoginAsync(request);

            Assert.NotNull(result);
            Assert.Equal(expectedToken, result.Token);
        }
    }
}