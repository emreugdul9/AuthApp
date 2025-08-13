using System.ComponentModel.DataAnnotations;

namespace AuthApp.Backend.Models.DTOs
{
    public record RegisterRequest
    (
        [Required, EmailAddress] string Email,
        [Required, MinLength(6)] string Password
    );
}
