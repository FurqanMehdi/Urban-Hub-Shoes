"use client";

import { useEffect, useState, useMemo, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product } from "@/types";

const categories = [
  { id: "all", name: "All Shoes" },
  { id: "running", name: "Running" },
  { id: "casual", name: "Casual" },
  { id: "formal", name: "Formal" },
  { id: "sports", name: "Sports" },
  { id: "boots", name: "Boots" },
  { id: "sandals", name: "Sandals" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const demoProducts: Product[] = [
    { _id: "1", name: "Urban Runner Pro", price: 149, description: "High-performance running shoes", images: [], sizes: ["7", "8", "9", "10"], category: "running", stock: 10, featured: true },
    { _id: "2", name: "Street Comfort", price: 129, description: "Casual everyday wear", images: [], sizes: ["7", "8", "9", "10"], category: "casual", stock: 15, trending: true },
    { _id: "3", name: "Executive Elite", price: 199, description: "Premium formal shoes", images: [], sizes: ["7", "8", "9", "10"], category: "formal", stock: 8 },
    { _id: "4", name: "Sport Max", price: 179, description: "All-purpose sports shoes", images: [], sizes: ["7", "8", "9", "10"], category: "sports", stock: 20, trending: true },
    { _id: "5", name: "Winter Boot", price: 249, description: "Warm winter boots", images: [], sizes: ["7", "8", "9", "10"], category: "boots", stock: 5 },
    { _id: "6", name: "Summer Breeze", price: 89, description: "Light summer sandals", images: [], sizes: ["7", "8", "9", "10"], category: "sandals", stock: 25 },
  ];

  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Read search query from URL on mount (safely)
  useEffect(() => {
    try {
      const urlSearch = searchParams.get("search");
      if (urlSearch) {
        setSearchQuery(urlSearch);
      }
    } catch (error) {
      console.error("Error reading search params:", error);
    }
  }, [searchParams]);

  // Fetch products from API on mount (no dependencies - runs once)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        console.log("Fetching all products from API...");
        const response = await fetch("/api/products");
        const data = await response.json();
        
        // Update with real products from database if available
        if (data.success && data.products && data.products.length > 0) {
          console.log("API products loaded:", data.products.length);
          setProducts(data.products);
        } else {
          console.log("No API products found, using demo products");
        }
      } catch (error) {
        console.log("API error, using demo products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array - runs once on mount

  // Apply client-side filters using useMemo (prevents infinite loops)
  const filteredProducts = useMemo(() => {
    console.log("Filtering products:", { selectedCategory, searchQuery, priceRange, productCount: products?.length || 0 });
    
    // Safety check - if products is empty/undefined, return empty array
    if (!products || products.length === 0) {
      console.log("No products available");
      return [];
    }
    
    let filtered = [...products];
    console.log("Products before filter:", filtered.map(p => ({ name: p.name, price: p.price, category: p.category })));

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p?.category === selectedCategory);
    }

    // Search filter (match any word from product title, order-agnostic)
    if (searchQuery?.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const terms = query.split(/\s+/).filter(Boolean);
      if (terms.length > 0) {
        filtered = filtered.filter((p) => {
          const name = (p?.name || "").toLowerCase();
          return terms.some((t) => name.includes(t));
        });
      }
    }

    // Price range filter
    console.log("Before price filter:", filtered.length, "products");
    filtered = filtered.filter((p) => {
      const raw = (p as any)?.price;
      const price = typeof raw === "number" ? raw : parseFloat(String(raw).replace(/[^\d.]/g, ""));
      if (Number.isNaN(price)) {
        console.log(`  ${p?.name}: price is NaN/invalid (${raw}) -> including product`);
        return true; // include products with invalid price instead of filtering them out
      }
      const inRange = price >= priceRange[0] && price <= priceRange[1];
      console.log(`  ${p?.name}: price=${price}, inRange=${inRange}`);
      return inRange;
    });

    console.log("Filtered results:", filtered.length, "products");
    return filtered;
  }, [selectedCategory, searchQuery, priceRange, products]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {selectedCategory === "all" ? "Shop Collection" : categories.find(c => c.id === selectedCategory)?.name}
          </h1>
          <p className="text-gray-600">
            {selectedCategory === "all" 
              ? "Discover our premium selection of footwear designed for every occasion."
              : `Browse our collection of ${categories.find(c => c.id === selectedCategory)?.name.toLowerCase()} shoes.`}
          </p>
          {mounted && products === demoProducts && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-yellow-700">Demo Mode: Showing sample products (Database not connected)</span>
            </div>
          )}
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="md:hidden flex items-center justify-center space-x-2 px-6 py-3 bg-white border rounded-full"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside
              className={`${
                isMobileFilterOpen ? "block" : "hidden"
              } md:block w-full md:w-64 flex-shrink-0`}
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="md:hidden"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Active Filters */}
                {(selectedCategory !== "all" || searchQuery || priceRange[0] > 0 || priceRange[1] < 100000) && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">Active Filters</span>
                      <button
                        onClick={() => {
                          setSelectedCategory("all");
                          setSearchQuery("");
                          setPriceRange([0, 100000]);
                        }}
                        className="text-xs text-blue-700 underline hover:text-blue-900"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategory !== "all" && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          Category: {categories.find(c => c.id === selectedCategory)?.name}
                          <button onClick={() => setSelectedCategory("all")} className="hover:text-blue-600">×</button>
                        </span>
                      )}
                      {searchQuery && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          Search: {searchQuery}
                          <button onClick={() => setSearchQuery("")} className="hover:text-blue-600">×</button>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Categories
                  </h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat.id
                            ? "bg-black text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Price Range
                  </h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="w-20 px-2 py-1 border rounded text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-20 px-2 py-1 border rounded text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="mb-4 text-sm text-gray-500">
                Showing {filteredProducts.length} products (Total in DB: {products.length})
              </div>
              {!mounted || loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-100 rounded-2xl aspect-[3/4] animate-pulse"
                    />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                    >
                      <Link href={`/product/${product._id}`}>
                        <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <span className="text-6xl">👟</span>
                          )}
                          {product.featured && (
                            <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-medium">
                              Featured
                            </span>
                          )}
                          {product.trending && (
                            <span className="absolute top-4 left-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                              Trending
                            </span>
                          )}
                        </div>
                        <div className="p-6">
                          <p className="text-sm text-gray-500 capitalize mb-1">
                            {product.category}
                          </p>
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-gray-900">
                              RS {product.price}
                            </span>
                            <span className="text-sm text-gray-500">
                              {product.stock > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">
                    No products found matching your criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchQuery("");
                      setPriceRange([0, 100000]);
                    }}
                    className="mt-4 text-black underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-b-2 border-black rounded-full" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
