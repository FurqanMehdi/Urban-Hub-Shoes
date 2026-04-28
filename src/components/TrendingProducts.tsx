"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Product } from "@/types";

const demoProducts: Product[] = [
  { _id: "t1", name: "AirStride Pro", price: 189, category: "running", images: [], sizes: ["7","8","9","10"], stock: 10, description: "" },
  { _id: "t2", name: "Urban Elite", price: 219, category: "formal", images: [], sizes: ["7","8","9","10"], stock: 10, description: "" },
  { _id: "t3", name: "Street Comfort", price: 149, category: "casual", images: [], sizes: ["7","8","9","10"], stock: 10, description: "" },
  { _id: "t4", name: "Trail Blazer", price: 179, category: "sports", images: [], sizes: ["7","8","9","10"], stock: 10, description: "" },
];

export default function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch("/api/products?trending=true");
        const data = await response.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts(demoProducts);
        }
      } catch {
        setProducts(demoProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center space-x-2 mb-12"
        >
          <TrendingUp className="w-6 h-6 text-gray-900" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Trending Now
          </h2>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 3).map((item, index) => (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/product/${item._id}`} className="group block">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                          👟
                        </span>
                      )}
                      {item.trending && (
                        <span className="absolute top-3 left-3 bg-black text-white px-2 py-1 rounded-full text-xs font-medium">
                          Trending
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500 uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          RS {item.price}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {item.name}
                      </h3>
                      <div className="w-full bg-black text-white py-3 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors text-center cursor-pointer">
                        Order on WhatsApp
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {products.length > 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center"
              >
                <Link
                  href="/shop"
                  className="group flex flex-col items-center justify-center w-full h-full min-h-[280px] bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-gray-400 transition-colors"
                >
                  <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">→</span>
                  <span className="font-semibold text-gray-900">View All</span>
                  <span className="text-sm text-gray-500 mt-1">{products.length - 3} more products</span>
                </Link>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
