import { useState } from "react";
import { useCart } from "../context/CartContext";
import type { ProductResponse } from "../types/product";
import styles from "./AddToCartButton.module.css";

interface AddToCartButtonProps {
  product: ProductResponse;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        productId: product.id,
        productName: product.name ?? "Product",
        price: product.price,
        imageUrl: product.imageUrl ?? undefined,
      },
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      className={`${styles.addToCartButton} ${added ? styles.added : ""}`}
      onClick={handleClick}
      aria-label={`Add ${product.name} to cart`}
      type="button"
    >
      {added ? "Added!" : "Add to Cart"}
    </button>
  );
}