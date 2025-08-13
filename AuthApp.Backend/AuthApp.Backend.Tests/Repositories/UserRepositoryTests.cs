using AuthApp.Backend.Data;
using AuthApp.Backend.Models;
using AuthApp.Backend.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace AuthApp.Backend.Tests.Repositories
{
    public class UserRepositoryTests : IDisposable
    {
        private readonly AppDbContext _context;
        private readonly UserRepository _userRepository;

        public UserRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _userRepository = new UserRepository(_context);
        }

        [Fact]
        public async Task AddUserAsync_AddsUser()
        {
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                PasswordHash = "hashedpassword"
            };

            await _userRepository.AddUserAsync(user);

            var addedUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
            Assert.NotNull(addedUser);
            Assert.Equal(user.Email, addedUser.Email);
        }

        [Fact]
        public async Task GetByEmailAsync_ReturnsUser()
        {
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                PasswordHash = "hashedpassword"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var result = await _userRepository.GetByEmailAsync(user.Email);

            Assert.NotNull(result);
            Assert.Equal(user.Email, result.Email);
        }

        [Fact]
        public async Task EmailExistsAsync_ReturnsTrue()
        {
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                PasswordHash = "hashedpassword"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var result = await _userRepository.EmailExistsAsync(user.Email);

            Assert.True(result);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}