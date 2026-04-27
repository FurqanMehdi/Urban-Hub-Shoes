"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Truck, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedOrder = localStorage.getItem("order");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else {
      router.push("/shop");
    }
    setLoading(false);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save order to database
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: order.product._id,
          quantity: order.quantity,
          totalPrice: order.totalPrice,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerAddress: formData.address,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Send WhatsApp message with full details
        const text = `New Order Received!\n\nProduct: ${order.product.name}\nQuantity: ${order.quantity}\nSize: ${order.size}\nTotal: RS ${order.totalPrice}\n\nCustomer Details:\nName: ${formData.name}\nPhone: ${formData.phone}\nAddress: ${formData.address}`;
        const adminWhatsApp = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "+923201924853";
        const phone = String(adminWhatsApp).replace(/\D/g, "");
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");

        localStorage.removeItem("order");
        toast.success("Order placed successfully!");
        router.push("/shop");
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="flex justify-center pt-40">
          <div className="animate-spin h-12 w-12 border-b-2 border-black rounded-full" />
        </div>
      </main>
    );
  }

  if (!order) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/shop"
            className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm p-6 lg:order-2"
            >
              <h2 className="text-lg font-semibold mb-6 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Summary
              </h2>

              <div className="flex gap-4 mb-6 pb-6 border-b">
                <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                  {order?.product?.images && order.product.images.length > 0 ? (
                    <img
                      src={order.product.images[0]}
                      alt={order.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">👟</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {order.product.name}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {order.product.category}
                  </p>
                  <p className="text-sm text-gray-500">Size: {order.size}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {order.quantity}
                  </p>
                  <p className="font-semibold text-gray-900 mt-1">
                    RS {order.product.price}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>RS {order.totalPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center">
                    <Truck className="w-4 h-4 mr-2" />
                    Shipping
                  </span>
                  <span>Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  RS {order.totalPrice}
                </span>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Cash on Delivery</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Pay when your order arrives
                </p>
              </div>
            </motion.div>

            {/* Customer Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold mb-6">
                Delivery Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="+1 234 567 890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                    placeholder="123 Street Name, City, State, ZIP"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-4 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </motion.button>

                <p className="text-xs text-gray-500 text-center">
                  By placing this order, you agree to our Terms of Service and
                  Privacy Policy
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
