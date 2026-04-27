"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, ShoppingCart, Package } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#000000", "#4B5563", "#9CA3AF", "#D1D5DB", "#E5E7EB"];

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<any>({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    salesByDay: [] as any[],
    bestSellingProducts: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics");
        const data = await res.json();
        if (data.success) setAnalytics(data.analytics);
      } catch {
        setAnalytics({
          totalSales: 12500,
          totalOrders: 85,
          pendingOrders: 12,
          totalProducts: 24,
          salesByDay: [
            { _id: "Mon", sales: 1200, orders: 8 },
            { _id: "Tue", sales: 2100, orders: 14 },
            { _id: "Wed", sales: 1800, orders: 12 },
            { _id: "Thu", sales: 2400, orders: 16 },
            { _id: "Fri", sales: 3200, orders: 21 },
            { _id: "Sat", sales: 1500, orders: 10 },
            { _id: "Sun", sales: 1100, orders: 6 },
          ],
          bestSellingProducts: [
            { _id: "Urban Runner", count: 45 },
            { _id: "Street Style", count: 38 },
            { _id: "Executive Elite", count: 29 },
            { _id: "Sport Max", count: 24 },
            { _id: "Winter Boot", count: 18 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const stats = [
    { name: "Total Revenue", value: `RS ${analytics.totalSales}`, icon: DollarSign, color: "bg-green-500" },
    { name: "Total Orders", value: analytics.totalOrders, icon: ShoppingCart, color: "bg-blue-500" },
    { name: "Pending Orders", value: analytics.pendingOrders, icon: TrendingUp, color: "bg-yellow-500" },
    { name: "Products", value: analytics.totalProducts, icon: Package, color: "bg-purple-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{loading ? "-" : stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Sales Overview (Last 7 Days)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.salesByDay as any[]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="_id" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #E5E7EB" }}
                  formatter={(value: any) => [`RS ${value}`, "Sales"]}
                />
                <Bar dataKey="sales" fill="#000000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Best Sellers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Best Selling Products</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.bestSellingProducts as any[]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="_id"
                >
                  {(analytics.bestSellingProducts as any[]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Top Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-sm mt-8"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Product</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Orders</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(analytics.bestSellingProducts as any[]).map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: COLORS[index % COLORS.length] + "20" }}>
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{product._id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">{product.count}</td>
                  <td className="px-6 py-4 text-right font-medium">RS {product.count * 149}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
