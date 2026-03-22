namespace backend.DTOs;

public class AddCartItemRequest
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}