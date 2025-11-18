import React, { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import supabase from "../supabaseClient";


const Orders = () => {
  const user = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");


  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }


      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setErrorMsg("Failed to load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <p className="pt-24 text-center">Loading your orders...</p>;
  if (!user) return <p className="pt-24 text-center">Please log in to see your orders.</p>;
  if (errorMsg) return <p className="pt-24 text-center text-red-600">{errorMsg}</p>;
  if (orders.length === 0)
    return <p className="pt-24 text-center text-gray-600">No orders found.</p>;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Order #{order.id}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-2">
                Placed on: {new Date(order.created_at).toLocaleString()}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                Total: <span className="font-semibold">${order.total}</span>
              </p>

              {/* Items list */}
              <ul className="divide-y divide-gray-200">
                {order.items?.map((item, idx) => (
                  <li key={idx} className="py-2 flex justify-between">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
