import { useState } from "react";
import { useCart } from "../context/CartContext";

type FormData = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

export default function CheckoutForm() {
  const { dispatch, cartTotal } = useCart();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function validateField(name: string, value: string): string {
    const trimmed = value.trim();

    switch (name) {
      case "fullName":
        return trimmed ? "" : "Full name is required";
      case "email":
        if (!trimmed) return "Email is required";
        return /\S+@\S+\.\S+/.test(trimmed) ? "" : "Enter a valid email";
      case "address":
        return trimmed ? "" : "Address is required";
      case "city":
        return trimmed ? "" : "City is required";
      case "state":
        return trimmed ? "" : "State is required";
      case "zipCode":
        if (!trimmed) return "ZIP code is required";
        return /^\d{5}$/.test(trimmed) ? "" : "ZIP code must be 5 digits";
      default:
        return "";
    }
  }

  function validateForm(data: FormData) {
    return {
      fullName: validateField("fullName", data.fullName),
      email: validateField("email", data.email),
      address: validateField("address", data.address),
      city: validateField("city", data.city),
      state: validateField("state", data.state),
      zipCode: validateField("zipCode", data.zipCode),
    };
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = validateForm(formData);
    setErrors(newErrors);

    setTouched({
      fullName: true,
      email: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
    });

    const hasErrors = Object.values(newErrors).some((error) => error);

    if (hasErrors) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      dispatch({ type: "CLEAR_CART" });
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div>
        <h3>Order placed successfully!</h3>
        <p>Thank you for your purchase.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Checkout</h3>
      <p>Total: ${cartTotal.toFixed(2)}</p>

      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.fullName && errors.fullName && <p>{errors.fullName}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.email && errors.email && <p>{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.address && errors.address && <p>{errors.address}</p>}
      </div>

      <div>
        <label htmlFor="city">City</label>
        <input
          id="city"
          name="city"
          type="text"
          value={formData.city}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.city && errors.city && <p>{errors.city}</p>}
      </div>

      <div>
        <label htmlFor="state">State</label>
        <input
          id="state"
          name="state"
          type="text"
          value={formData.state}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.state && errors.state && <p>{errors.state}</p>}
      </div>

      <div>
        <label htmlFor="zipCode">ZIP Code</label>
        <input
          id="zipCode"
          name="zipCode"
          type="text"
          value={formData.zipCode}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.zipCode && errors.zipCode && <p>{errors.zipCode}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
}