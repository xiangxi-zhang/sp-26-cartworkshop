import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '../context/CartContext';

// Test component to access the hook
function TestComponent() {
  const { state, dispatch, cartItemCount, cartTotal } = useCart();
  return (
    <div>
      <div data-testid="item-count">{cartItemCount}</div>
      <div data-testid="total">{cartTotal}</div>
      <div data-testid="is-open">{state.isOpen.toString()}</div>
      <button
        data-testid="add-item"
        onClick={() =>
          dispatch({
            type: 'ADD_TO_CART',
            payload: {
              productId: 1,
              productName: 'Test Product',
              price: 10,
              imageUrl: 'test.jpg',
            },
          })
        }
      >
        Add Item
      </button>
    </div>
  );
}

describe('CartContext', () => {
  it('should provide initial state', () => {
    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    expect(getByTestId('item-count')).toHaveTextContent('0');
    expect(getByTestId('total')).toHaveTextContent('0');
    expect(getByTestId('is-open')).toHaveTextContent('false');
  });

  it('should update state on dispatch', async () => {
    const user = userEvent.setup();
    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    const button = getByTestId('add-item');
    await user.click(button);
    expect(getByTestId('item-count')).toHaveTextContent('1');
    expect(getByTestId('total')).toHaveTextContent('10');
  });
});