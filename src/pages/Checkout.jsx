import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../components/CheckoutForm";
import { useUser } from "@supabase/auth-helpers-react";
import supabase from "../supabaseClient";

const Checkout = () => {
  const navigate = useNavigate();
  const user = useUser();
  const [orderComplete, setOrderComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [cart, setCart] = useState({ items: [], total: 0 });

  // ✅ Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);

      const subtotal = parsedCart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const shipping = subtotal > 100 ? 0 : 15;
      const tax = subtotal * 0.08;
      const total = subtotal + shipping + tax;

      setCart({ items: parsedCart, total });
    }
  }, []);

  // ✅ Handle order submission (with customer details)
  const handleOrderSubmit = async (formData) => {
    if (!user || cart.items.length === 0) {
      setErrorMsg("Your cart is empty or you are not logged in.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // Insert order into Supabase (with customer_details)
      const { error } = await supabase.from("orders").insert([
        {
          user_id: user.id,
          items: cart.items,         // 🛒 save items
          total: cart.total,         // 💰 save total
          status: "confirmed",
          customer_details: formData // 👤 save customer info
        },
      ]);

      if (error) throw error;

      setOrderComplete(true);

      // ✅ Clear cart in localStorage
      localStorage.removeItem("cart");

      // Redirect to home after 3 seconds
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error("Checkout failed:", err);
      setErrorMsg("Failed to process your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete)
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your purchase. You'll receive a confirmation email
            shortly.
          </p>
          <p className="text-gray-500">Redirecting to home page...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </div>

        {errorMsg && <p className="text-red-600 text-center mb-4">{errorMsg}</p>}

        <CheckoutForm
          cartItems={cart.items}
          cartTotal={cart.total}
          onSubmit={handleOrderSubmit} // ✅ now passes formData correctly
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Checkout;
