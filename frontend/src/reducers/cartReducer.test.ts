import { describe, it, expect } from 'vitest';
import { cartReducer, initialCartState } from '../reducers/cartReducer';

describe('cartReducer', () => {
  it('should add a new item to cart', () => {
    const action = {
      type: 'ADD_TO_CART' as const,
      payload: {
        productId: 1,
        productName: 'Test Product',
        price: 10,
        imageUrl: 'test.jpg',
      },
    };
    const newState = cartReducer(initialCartState, action);
    expect(newState.items).toHaveLength(1);
    expect(newState.items[0]).toEqual({
      productId: 1,
      productName: 'Test Product',
      price: 10,
      imageUrl: 'test.jpg',
      quantity: 1,
    });
  });

  it('should increment quantity for existing item', () => {
    const state = {
      ...initialCartState,
      items: [
        {
          productId: 1,
          productName: 'Test Product',
          price: 10,
          imageUrl: 'test.jpg',
          quantity: 1,
        },
      ],
    };
    const action = {
      type: 'ADD_TO_CART' as const,
      payload: {
        productId: 1,
        productName: 'Test Product',
        price: 10,
        imageUrl: 'test.jpg',
      },
    };
    const newState = cartReducer(state, action);
    expect(newState.items[0].quantity).toBe(2);
  });

  it('should update quantity', () => {
    const state = {
      ...initialCartState,
      items: [
        {
          productId: 1,
          productName: 'Test Product',
          price: 10,
          imageUrl: 'test.jpg',
          quantity: 1,
        },
      ],
    };
    const action = {
      type: 'UPDATE_QUANTITY' as const,
      payload: {
        productId: 1,
        quantity: 3,
      },
    };
    const newState = cartReducer(state, action);
    expect(newState.items[0].quantity).toBe(3);
  });

  it('should remove item when quantity is 0', () => {
    const state = {
      ...initialCartState,
      items: [
        {
          productId: 1,
          productName: 'Test Product',
          price: 10,
          imageUrl: 'test.jpg',
          quantity: 1,
        },
      ],
    };
    const action = {
      type: 'UPDATE_QUANTITY' as const,
      payload: {
        productId: 1,
        quantity: 0,
      },
    };
    const newState = cartReducer(state, action);
    expect(newState.items).toHaveLength(0);
  });

  it('should clear cart', () => {
    const state = {
      ...initialCartState,
      items: [
        {
          productId: 1,
          productName: 'Test Product',
          price: 10,
          imageUrl: 'test.jpg',
          quantity: 1,
        },
      ],
    };
    const action = { type: 'CLEAR_CART' as const };
    const newState = cartReducer(state, action);
    expect(newState.items).toHaveLength(0);
  });

  it('should toggle cart open state', () => {
    const action = { type: 'TOGGLE_CART' as const };
    const newState = cartReducer(initialCartState, action);
    expect(newState.isOpen).toBe(true);
  });
});