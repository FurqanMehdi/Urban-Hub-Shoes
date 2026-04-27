"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

const trendingItems = [
  {
    id: "1",
    name: "AirStride Pro",
    category: "Running",
    price: 189,
    image: "🏃",
    tag: "Best Seller",
  },
  {
    id: "2",
    name: "Urban Walk Elite",
    category: "Casual",
    price: 149,
    image: "🚶",
    tag: "Trending",
  },
  {
    id: "3",
    name: "SportMax Ultra",
    category: "Sports",
    price: 219,
    image: "⚽",
    tag: "New",
  },
];

export default function TrendingProducts() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
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

        {/* Horizontal Scroll on Mobile, Grid on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
            >
              <Link href={`/product/${item.id}`}>
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                  {/* Image Container */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                    <span className="text-8xl transform group-hover:scale-110 transition-transform duration-500">
                      {item.image}
                    </span>

                    {/* Tag */}
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.tag === "Best Seller"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.tag === "New"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
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
        </div>
      </div>
    </section>
  );
}
