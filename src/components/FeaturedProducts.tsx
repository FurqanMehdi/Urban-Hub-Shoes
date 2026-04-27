"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("/api/products?featured=true");
        const data = await response.json();
        if (data.success && data.products && data.products.length > 0) {
          setProducts(data.products.slice(0, 4));
        }
        // If no products, will show demo data (products.length === 0)
      } catch (error) {
        console.error("Error fetching featured products:", error);
        // On error, show demo products (products.length stays 0)
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="featured" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-gray-600 max-w-xl">
              Handpicked favorites designed for performance and style. Each pair
              tells a story of craftsmanship.
            </p>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center space-x-2 text-black font-medium mt-4 md:mt-0"
          >
            <span>View All</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-2xl aspect-[3/4] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.length > 0 ? (
              products.map((product) => (
                <Link key={product._id} href={`/product/${product._id}`} className="block group cursor-pointer">
                  <motion.div variants={itemVariants}>
                    <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden mb-4">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <span className="text-4xl">👟</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-full bg-white text-black py-3 rounded-full font-medium text-sm text-center shadow-lg">
                          View Details
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-sm">{product.category}</p>
                      <p className="font-bold text-gray-900">
                        RS {product.price}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              // Demo Products with Links
              [...Array(4)].map((_, i) => (
                <Link key={i} href="/shop" className="block group cursor-pointer">
                  <motion.div variants={itemVariants}>
                    <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl">👟</span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-white px-3 py-1 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-full bg-white text-black py-3 rounded-full font-medium text-sm text-center shadow-lg">
                          View Details
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                        Urban Runner {i + 1}
                      </h3>
                      <p className="text-gray-500 text-sm">Running</p>
                      <p className="font-bold text-gray-900">RS {120 + i * 20}</p>
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
