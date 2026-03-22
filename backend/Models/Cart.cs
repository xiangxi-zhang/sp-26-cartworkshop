using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Cart
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string UserId { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<CartItem> Items { get; set; } = new();
}