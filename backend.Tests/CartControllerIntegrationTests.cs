using System.Net;
using System.Net.Http.Json;
using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace backend.Tests;

public class CartControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public CartControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureAppConfiguration((context, config) =>
            {
                config.AddInMemoryCollection(new Dictionary<string, string>
                {
                    ["ConnectionStrings:DefaultConnection"] = "Data Source=test.db"
                });
            });
        });
    }

    [Fact]
    public async Task PostCart_AddsItemToCart_ReturnsOkWithCartResponse()
    {
        // Arrange
        var client = _factory.CreateClient();
        var request = new AddCartItemRequest { ProductId = 1, Quantity = 2 };

        // Act
        var response = await client.PostAsJsonAsync("/api/cart", request);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var cartResponse = await response.Content.ReadFromJsonAsync<CartResponse>();
        Assert.NotNull(cartResponse);
        Assert.Single(cartResponse.Items);
        Assert.Equal(1, cartResponse.Items[0].ProductId);
        Assert.Equal("Wireless Headphones", cartResponse.Items[0].ProductName);
        Assert.Equal(2, cartResponse.Items[0].Quantity);
        Assert.Equal(299.98m, cartResponse.Items[0].LineTotal);
        Assert.Equal(2, cartResponse.TotalItems);
        Assert.Equal(299.98m, cartResponse.Subtotal);
        Assert.Equal(299.98m, cartResponse.Total);
    }
}