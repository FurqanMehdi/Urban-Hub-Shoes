"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product } from "@/types";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data?.success && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (e) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const newArrivals = useMemo(() => {
    const days = 14;
    const now = new Date();
    const toTime = (d: any) => {
      const dateStr = (d as any)?.createdAt || (d as any)?.postedAt;
      const dt = dateStr ? new Date(dateStr) : undefined;
      return dt && !isNaN(dt.getTime()) ? dt.getTime() : undefined;
    };

    const filtered = products.filter((p) => {
      const t = toTime(p);
      if (!t) return false;
      const diffDays = (now.getTime() - t) / 86400000; // ms in a day
      return diffDays >= 0 && diffDays <= days;
    });

    return filtered.sort((a, b) => {
      const tb = toTime(b) ?? 0;
      const ta = toTime(a) ?? 0;
      return tb - ta; // newest first
    });
  }, [products]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="pt-24 pb-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">New Arrivals</h1>
          <p className="text-gray-600">Products added in the last 14 days</p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4 text-sm text-gray-500">
            {newArrivals.length > 0 ? `Showing ${newArrivals.length} products` : ""}
          </div>

          {!mounted || loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newArrivals.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <Link href={`/product/${product._id}`}>
                    <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-6xl">👟</span>
                      )}
                      <span className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
                        New
                      </span>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-gray-500 capitalize mb-1">{product.category}</p>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-900">RS {product.price}</span>
                        <span className="text-sm text-gray-500">
                          {product.stock > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No new arrivals available</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
