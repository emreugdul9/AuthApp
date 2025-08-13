using AuthApp.Backend.Models;
using AuthApp.Backend.Models.DTOs;
using AuthApp.Backend.Repositories.Interfaces;
using AuthApp.Backend.Services.Interfaces;
using BC = BCrypt.Net.BCrypt;

namespace AuthApp.Backend.Services
{
    public class AuthService : IAuthService
    {   
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly IJwtService _jwtService;

        public AuthService(IUserRepository userRepository, IConfiguration configuration, IJwtService jwtService)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _jwtService = jwtService;
        }
        public async Task<LoginResponse> LoginAsync(LoginRequest req)
        {
            var user = await _userRepository.GetByEmailAsync(req.Email);
            if (user == null || !BC.Verify(req.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password.");
            }
            var token = _jwtService.GenerateToken(user);
            return new LoginResponse(token);
        }

        public async Task<string> RegisterAsync(RegisterRequest req)
        {
            if(await _userRepository.EmailExistsAsync(req.Email))
            {
                throw new InvalidOperationException("Email already exists.");
            }

            var user = new User
            {
                Email = req.Email,
                PasswordHash = BC.HashPassword(req.Password)
            };
            await _userRepository.AddUserAsync(user);
            return "User registered successfully.";

        }
    }
}
