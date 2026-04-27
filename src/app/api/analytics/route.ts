import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

// GET /api/analytics - Get dashboard analytics
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Total sales (completed orders)
    const totalSales = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    
    // Total orders
    const totalOrders = await Order.countDocuments();
    
    // Pending orders
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    
    // Total products
    const totalProducts = await Product.countDocuments();
    
    // Recent orders (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentOrders = await Order.find({
      createdAt: { $gte: sevenDaysAgo },
    }).populate('product');
    
    // Best selling products
    const bestSellingProducts = await Order.aggregate([
      { $group: { _id: '$product', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    
    // Sales by day (last 7 days)
    const salesByDay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          sales: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    
    return NextResponse.json(
      {
        success: true,
        analytics: {
          totalSales: totalSales[0]?.total || 0,
          totalOrders,
          pendingOrders,
          totalProducts,
          recentOrders,
          bestSellingProducts,
          salesByDay,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
