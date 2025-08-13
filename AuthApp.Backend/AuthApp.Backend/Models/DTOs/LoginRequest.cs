using System.ComponentModel.DataAnnotations;

namespace AuthApp.Backend.Models.DTOs
{
    public record LoginRequest
    (
        [Required, EmailAddress] string Email,
        [Required] string Password
    );
}
