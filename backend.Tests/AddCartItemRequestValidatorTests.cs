using Xunit;
using backend.DTOs;
using backend.Validators;
using FluentValidation.TestHelper;

namespace backend.Tests;

public class AddCartItemRequestValidatorTests
{
    private readonly AddCartItemRequestValidator _validator = new();

    [Fact]
    public void Should_Have_Error_When_ProductId_Is_Less_Than_Or_Equal_To_Zero()
    {
        var request = new AddCartItemRequest { ProductId = 0, Quantity = 1 };
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.ProductId);
    }

    [Fact]
    public void Should_Not_Have_Error_When_ProductId_Is_Greater_Than_Zero()
    {
        var request = new AddCartItemRequest { ProductId = 1, Quantity = 1 };
        var result = _validator.TestValidate(request);
        result.ShouldNotHaveValidationErrorFor(x => x.ProductId);
    }

    [Fact]
    public void Should_Have_Error_When_Quantity_Is_Less_Than_One()
    {
        var request = new AddCartItemRequest { ProductId = 1, Quantity = 0 };
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.Quantity);
    }

    [Fact]
    public void Should_Have_Error_When_Quantity_Is_Greater_Than_99()
    {
        var request = new AddCartItemRequest { ProductId = 1, Quantity = 100 };
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.Quantity);
    }

    [Fact]
    public void Should_Not_Have_Error_When_Quantity_Is_Between_1_And_99()
    {
        var request = new AddCartItemRequest { ProductId = 1, Quantity = 50 };
        var result = _validator.TestValidate(request);
        result.ShouldNotHaveValidationErrorFor(x => x.Quantity);
    }

    [Fact]
    public void Should_Not_Have_Error_When_Quantity_Is_1()
    {
        var request = new AddCartItemRequest { ProductId = 1, Quantity = 1 };
        var result = _validator.TestValidate(request);
        result.ShouldNotHaveValidationErrorFor(x => x.Quantity);
    }

    [Fact]
    public void Should_Not_Have_Error_When_Quantity_Is_99()
    {
        var request = new AddCartItemRequest { ProductId = 1, Quantity = 99 };
        var result = _validator.TestValidate(request);
        result.ShouldNotHaveValidationErrorFor(x => x.Quantity);
    }
}