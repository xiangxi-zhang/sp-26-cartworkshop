using backend.DTOs;
using FluentValidation;

namespace backend.Validators;

public class AddCartItemRequestValidator : AbstractValidator<AddCartItemRequest>
{
    public AddCartItemRequestValidator()
    {
        RuleFor(x => x.ProductId)
            .GreaterThan(0);

        RuleFor(x => x.Quantity)
            .InclusiveBetween(1, 99);
    }
}