using AuthApp.Backend.Models;
using AuthApp.Backend.Services;
using Microsoft.Extensions.Configuration;
using Moq;
using System.IdentityModel.Tokens.Jwt;
using Xunit;

namespace AuthApp.Backend.Tests.Services
{
    public class JwtServiceTests
    {
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly JwtService _jwtService;

        public JwtServiceTests()
        {
            _mockConfiguration = new Mock<IConfiguration>();
            
            _mockConfiguration.Setup(x => x["Jwt:Key"]).Returns("ThisIsASecretKeyForTestingPurposesOnly123456789");
            _mockConfiguration.Setup(x => x["Jwt:Issuer"]).Returns("TestIssuer");
            _mockConfiguration.Setup(x => x["Jwt:Audience"]).Returns("TestAudience");
            
            _jwtService = new JwtService(_mockConfiguration.Object);
        }

        [Fact]
        public void GenerateToken_ReturnsValidJwt()
        {
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                PasswordHash = "hashedpassword"
            };

            var token = _jwtService.GenerateToken(user);

            Assert.NotNull(token);
            Assert.NotEmpty(token);
            
            var tokenHandler = new JwtSecurityTokenHandler();
            Assert.True(tokenHandler.CanReadToken(token));
        }

        [Fact]
        public void ValidateToken_ValidToken_ReturnsClaimsPrincipal()
        {
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                PasswordHash = "hashedpassword"
            };
            
            var token = _jwtService.GenerateToken(user);
            var result = _jwtService.ValidateToken(token);

            Assert.NotNull(result);
        }

        [Fact]
        public void ValidateToken_InvalidToken_ReturnsNull()
        {
            var result = _jwtService.ValidateToken("invalid.token.here");

            Assert.Null(result);
        }
    }
}