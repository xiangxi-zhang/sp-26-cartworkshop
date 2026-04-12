using backend.Data;
using backend.DTOs;
using backend.Models;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/cart")]
[Authorize]
public class CartController : ControllerBase
{
    private string CurrentUserId => User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new UnauthorizedAccessException("User not authenticated");

    private readonly MarketplaceContext _context;
    private readonly IValidator<AddCartItemRequest> _addValidator;
    private readonly IValidator<UpdateCartItemRequest> _updateValidator;

    public CartController(
        MarketplaceContext context,
        IValidator<AddCartItemRequest> addValidator,
        IValidator<UpdateCartItemRequest> updateValidator)
    {
        _context = context;
        _addValidator = addValidator;
        _updateValidator = updateValidator;
    }

    [HttpGet]
    public async Task<ActionResult<CartResponse>> GetCart()
    {
        var cart = await GetOrCreateCartAsync();
        return Ok(MapCartResponse(cart));
    }

    [HttpPost]
    public async Task<ActionResult<CartResponse>> AddItem(AddCartItemRequest request)
    {
        var validationResult = await _addValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            return ValidationProblemFromFluentValidation(validationResult);
        }

        var product = await _context.Products.FindAsync(request.ProductId);
        if (product == null)
        {
            return NotFound($"Product {request.ProductId} not found.");
        }

        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart == null)
        {
            cart = new Cart
            {
                UserId = CurrentUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Items = new List<CartItem>()
            };

            _context.Carts.Add(cart);
        }

        var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId);

        if (existingItem != null)
        {
            existingItem.Quantity += request.Quantity;
        }
        else
        {
            cart.Items.Add(new CartItem
            {
                ProductId = request.ProductId,
                Quantity = request.Quantity
            });
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstAsync(c => c.UserId == CurrentUserId);

        return Ok(MapCartResponse(cart));
    }

    [HttpPut("{cartItemId:int}")]
    public async Task<ActionResult<CartResponse>> UpdateItemQuantity(
        int cartItemId,
        UpdateCartItemRequest request)
    {
        var validationResult = await _updateValidator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            return ValidationProblemFromFluentValidation(validationResult);
        }

        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart == null)
        {
            return NotFound("Cart not found.");
        }

        var item = cart.Items.FirstOrDefault(i => i.Id == cartItemId);
        if (item == null)
        {
            return NotFound($"Cart item {cartItemId} not found.");
        }

        item.Quantity = request.Quantity;
        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstAsync(c => c.UserId == CurrentUserId);

        return Ok(MapCartResponse(cart));
    }

    [HttpDelete("{cartItemId:int}")]
    public async Task<ActionResult<CartResponse>> RemoveItem(int cartItemId)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart == null)
        {
            return NotFound("Cart not found.");
        }

        var item = cart.Items.FirstOrDefault(i => i.Id == cartItemId);
        if (item == null)
        {
            return NotFound($"Cart item {cartItemId} not found.");
        }

        _context.CartItems.Remove(item);
        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstAsync(c => c.UserId == CurrentUserId);

        return Ok(MapCartResponse(cart));
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart()
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart == null)
        {
            return NotFound("Cart not found.");
        }

        _context.CartItems.RemoveRange(cart.Items);
        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<Cart> GetOrCreateCartAsync()
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart == null)
        {
            cart = new Cart
            {
                UserId = CurrentUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Items = new List<CartItem>()
            };

            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();

            cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstAsync(c => c.UserId == CurrentUserId);
        }

        return cart;
    }

    private ActionResult ValidationProblemFromFluentValidation(
        FluentValidation.Results.ValidationResult validationResult)
    {
        var modelState = new ModelStateDictionary();

        foreach (var error in validationResult.Errors)
        {
            modelState.AddModelError(error.PropertyName, error.ErrorMessage);
        }

        return ValidationProblem(modelState);
    }

    private static CartResponse MapCartResponse(Cart cart)
    {
        var items = cart.Items.Select(item => new CartItemResponse
        {
            Id = item.Id,
            ProductId = item.ProductId,
            ProductName = item.Product.Name,
            Price = item.Product.Price,
            ImageUrl = item.Product.ImageUrl,
            Quantity = item.Quantity,
            LineTotal = item.Product.Price * item.Quantity
        }).ToList();

        return new CartResponse
        {
            Id = cart.Id,
            UserId = cart.UserId,
            Items = items,
            TotalItems = items.Sum(i => i.Quantity),
            Subtotal = items.Sum(i => i.LineTotal),
            Total = items.Sum(i => i.LineTotal),
            CreatedAt = cart.CreatedAt,
            UpdatedAt = cart.UpdatedAt
        };
    }
}