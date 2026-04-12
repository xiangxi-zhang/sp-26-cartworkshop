using Xunit;
using backend.DTOs;
using backend.Validators;
using FluentValidation.TestHelper;

namespace backend.Tests;

public class UpdateCartItemRequestValidatorTests
{
    private readonly UpdateCartItemRequestValidator _validator = new();

    [Fact]
    public void Should_Have_Error_When_Quantity_Is_Less_Than_One()
    {
        var request = new UpdateCartItemRequest { Quantity = 0 };
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.Quantity);
    }

    [Fact]
    public void Should_Have_Error_When_Quantity_Is_Greater_Than_99()
    {
        var request = new UpdateCartItemRequest { Quantity = 100 };
        var result = _validator.TestValidate(request);
        result.ShouldHaveValidationErrorFor(x => x.Quantity);
    }

    [Fact]
    public void Should_Not_Have_Error_When_Quantity_Is_Between_1_And_99()
    {
        var request = new UpdateCartItemRequest { Quantity = 50 };
        var result = _validator.TestValidate(request);
        result.ShouldNotHaveValidationErrorFor(x => x.Quantity);
    }

    [Fact]
    public void Should_Not_Have_Error_When_Quantity_Is_1()
    {
        var request = new UpdateCartItemRequest { Quantity = 1 };
        var result = _validator.TestValidate(request);
        result.ShouldNotHaveValidationErrorFor(x => x.Quantity);
    }

    [Fact]
    public void Should_Not_Have_Error_When_Quantity_Is_99()
    {
        var request = new UpdateCartItemRequest { Quantity = 99 };
        var result = _validator.TestValidate(request);
        result.ShouldNotHaveValidationErrorFor(x => x.Quantity);
    }
}