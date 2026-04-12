import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider } from '../context/CartContext';
import AddToCartButton from '../components/AddToCartButton';

const mockProduct = {
  id: 1,
  name: 'Test Product',
  price: 10,
  imageUrl: 'test.jpg',
};

describe('AddToCartButton', () => {
  it('should render with initial text', () => {
    render(
      <CartProvider>
        <AddToCartButton product={mockProduct} />
      </CartProvider>
    );
    expect(screen.getByRole('button', { name: /add test product to cart/i })).toHaveTextContent('Add to Cart');
  });

  it('should show "Added!" after click', async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <AddToCartButton product={mockProduct} />
      </CartProvider>
    );
    const button = screen.getByRole('button', { name: /add test product to cart/i });
    await user.click(button);
    expect(button).toHaveTextContent('Added!');
  });
});