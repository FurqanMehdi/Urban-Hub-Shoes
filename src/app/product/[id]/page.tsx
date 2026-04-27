"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product } from "@/types";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        const data = await response.json();
        if (data.success && data.product) {
          setProduct(data.product);
          fetchRecommended(data.product.category, data.product._id);
        } else {
          loadDemo();
        }
      } catch {
        loadDemo();
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommended = async (category: string, currentId: string) => {
      try {
        const response = await fetch(`/api/products?category=${category}`);
        const data = await response.json();
        if (data.success && data.products) {
          // Filter out current product and limit to 4
          const filtered = data.products
            .filter((p: Product) => p._id !== currentId)
            .slice(0, 4);
          setRecommendedProducts(filtered);
        }
      } catch {
        // Use demo products as fallback
        setRecommendedProducts([
          { _id: "2", name: "Street Comfort", price: 129, description: "Casual everyday wear", images: [], sizes: ["7", "8", "9", "10"], category: "casual", stock: 15, trending: true },
          { _id: "3", name: "Executive Elite", price: 199, description: "Premium formal shoes", images: [], sizes: ["7", "8", "9", "10"], category: "formal", stock: 8 },
          { _id: "4", name: "Sport Max", price: 179, description: "All-purpose sports shoes", images: [], sizes: ["7", "8", "9", "10"], category: "sports", stock: 20, trending: true },
          { _id: "5", name: "Winter Boot", price: 249, description: "Warm winter boots", images: [], sizes: ["7", "8", "9", "10"], category: "boots", stock: 5 },
        ]);
      }
    };

    const loadDemo = () => {
      setProduct({
        _id: params.id as string,
        name: "Urban Runner Pro",
        price: 149,
        description: "Experience ultimate comfort and style with our Urban Runner Pro. These premium running shoes feature advanced cushioning technology and breathable mesh upper for all-day comfort.",
        images: [],
        sizes: ["7", "7.5", "8", "8.5", "9", "9.5", "10", "11"],
        category: "running",
        stock: 10,
      });
      // Load demo recommended products
      setRecommendedProducts([
        { _id: "2", name: "Street Comfort", price: 129, description: "Casual everyday wear", images: [], sizes: ["7", "8", "9", "10"], category: "casual", stock: 15, trending: true },
        { _id: "3", name: "Executive Elite", price: 199, description: "Premium formal shoes", images: [], sizes: ["7", "8", "9", "10"], category: "formal", stock: 8 },
        { _id: "4", name: "Sport Max", price: 179, description: "All-purpose sports shoes", images: [], sizes: ["7", "8", "9", "10"], category: "sports", stock: 20, trending: true },
        { _id: "5", name: "Winter Boot", price: 249, description: "Warm winter boots", images: [], sizes: ["7", "8", "9", "10"], category: "boots", stock: 5 },
      ]);
    };
    fetchProduct();
  }, [params.id]);

  const handleWhatsAppOrder = () => {
    if (!selectedSize) { toast.error("Please select a size"); return; }
    const total = (product?.price || 0) * quantity;

    // Save order and go to checkout to collect full details; WhatsApp is sent from checkout on submit
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem("order", JSON.stringify({ product, quantity, size: selectedSize, totalPrice: total }));
      }
    } catch (e) {
      console.error("localStorage error:", e);
    }

    router.push("/checkout");
  };

  if (loading) return <main><Navbar/><div className="flex justify-center pt-40"><div className="animate-spin h-12 w-12 border-b-2 border-black rounded-full"/></div></main>;
  if (!product) return <main><Navbar/><div className="flex justify-center pt-40">Not Found</div></main>;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/shop" className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to Shop
        </Link>
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-3xl flex items-center justify-center overflow-hidden">
              {(product.images && product.images.length > 0) ? (
                <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-9xl">👟</span>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} className={`aspect-square bg-gray-100 rounded-xl overflow-hidden ${activeImage === i ? "ring-2 ring-black" : ""}`}>
                    <img src={img} alt={`Thumbnail ${i+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 uppercase mb-2">{product.category}</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">{[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}</div>
                <span className="text-sm text-gray-500">(128 reviews)</span>
              </div>
              <p className="text-3xl font-bold">RS {product.price}</p>
              <p className={`mt-2 text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
              </p>
            </div>
            <p className="text-gray-600">{product.description}</p>
            <div>
              <h3 className="font-semibold mb-3">Select Size</h3>
              {product.sizes && product.sizes.length > 0 ? (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <button 
                      key={size} 
                      onClick={() => setSelectedSize(size)} 
                      className={`py-3 rounded-lg border-2 text-sm font-medium transition-colors ${selectedSize === size ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No sizes available</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full border-2 flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full border-2 flex items-center justify-center"><Plus className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 flex justify-between">
              <span className="text-gray-600">Total Price:</span>
              <span className="text-2xl font-bold">RS {product.price * quantity}</span>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleWhatsAppOrder} className="w-full bg-black text-white py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-gray-800">
              <ShoppingCart className="w-5 h-5" />Order on WhatsApp
            </motion.button>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[{icon: Truck, label: "Free Delivery"}, {icon: Shield, label: "2 Year Warranty"}, {icon: RotateCcw, label: "30 Day Returns"}].map((item) => (
                <div key={item.label} className="flex flex-col items-center text-center">
                  <item.icon className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">You May Also Like</h2>
                <p className="text-gray-500 mt-1">Similar products from the same category</p>
              </div>
              <Link href="/shop" className="hidden sm:flex items-center text-black font-medium hover:underline">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((recProduct, index) => (
                <motion.div
                  key={recProduct._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/product/${recProduct._id}`} className="group block">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                      <div className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                        {recProduct.images && recProduct.images.length > 0 ? (
                          <img src={recProduct.images[0]} alt={recProduct.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <span className="text-6xl">👟</span>
                        )}
                        {recProduct.trending && (
                          <span className="absolute top-3 left-3 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            Trending
                          </span>
                        )}
                        {recProduct.featured && (
                          <span className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-gray-500 uppercase mb-1">{recProduct.category}</p>
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-600 transition-colors line-clamp-1">{recProduct.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">RS {recProduct.price}</span>
                          <span className="text-xs text-gray-500">{recProduct.stock > 0 ? "In Stock" : "Out of Stock"}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/shop" className="inline-flex items-center text-black font-medium hover:underline">
                View All Products <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
