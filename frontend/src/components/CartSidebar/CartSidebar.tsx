import { useCart } from "../../context/CartContext";
import CheckoutForm from "../CheckoutForm";
import styles from "./CartSidebar.module.css";

export function CartSidebar() {
  const { state, dispatch, cartTotal } = useCart();

  if (!state.isOpen) return null;

  return (
    <>
      <div
        className={styles.overlay}
        onClick={() => dispatch({ type: "TOGGLE_CART" })}
        aria-label="Close cart"
      />
      <aside className={styles.sidebar} aria-label="Shopping cart">
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>Your Cart</h2>
          <button
            className={styles.closeButton}
            onClick={() => dispatch({ type: "TOGGLE_CART" })}
            aria-label="Close cart"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className={styles.items}>
          {state.items.length === 0 ? (
            <p className={styles.emptyMessage}>Your cart is empty</p>
          ) : (
            state.items.map((item) => (
              <div key={item.productId} className={styles.cartItem}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className={styles.itemImage}
                  />
                ) : (
                  <div className={styles.itemPlaceholder}>📦</div>
                )}

                <div className={styles.itemDetails}>
                  <p className={styles.itemName}>{item.productName}</p>
                  <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>

                  <div className={styles.quantityControls}>
                    <button
                      className={styles.quantityButton}
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_QUANTITY",
                          payload: {
                            productId: item.productId,
                            quantity: item.quantity - 1,
                          },
                        })
                      }
                      aria-label={`Decrease quantity of ${item.productName}`}
                      type="button"
                    >
                      −
                    </button>

                    <span className={styles.quantity}>{item.quantity}</span>

                    <button
                      className={styles.quantityButton}
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_QUANTITY",
                          payload: {
                            productId: item.productId,
                            quantity: item.quantity + 1,
                          },
                        })
                      }
                      aria-label={`Increase quantity of ${item.productName}`}
                      type="button"
                    >
                      +
                    </button>
                  </div>

                  <button
                    className={styles.removeButton}
                    onClick={() =>
                      dispatch({
                        type: "REMOVE_FROM_CART",
                        payload: { productId: item.productId },
                      })
                    }
                    aria-label={`Remove ${item.productName} from cart`}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {state.items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.total}>
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <CheckoutForm />

            <button
              className={styles.clearButton}
              onClick={() => dispatch({ type: "CLEAR_CART" })}
              aria-label="Clear cart"
              type="button"
            >
              Clear Cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}