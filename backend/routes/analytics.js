import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const revenueStats = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const revenue = revenueStats.length > 0 ? revenueStats[0].total : 0;

    const ordersCount = await Order.countDocuments();
    const productsCount = await Product.countDocuments();
    
    const uniqueEmails = await Order.distinct('customer_email');
    const customersCount = uniqueEmails.length;

    res.json({
      revenue,
      orders: ordersCount,
      products: productsCount,
      customers: customersCount
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
});

// Get sales chart data (Last 7 days)
router.get('/sales', async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const sales = await Order.aggregate([
      { $match: { created_at: { $gte: sevenDaysAgo } } },
      { $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
          amount: { $sum: "$total" },
          orders: { $sum: 1 }
      }},
      { $sort: { "_id": 1 } },
      { $project: {
          _id: 0,
          date: "$_id",
          amount: 1,
          orders: 1
      }}
    ]);

    res.json(sales);
  } catch (err) {
    console.error('Sales Analytics Error:', err);
    res.status(500).json({ message: 'Error fetching sales data', error: err.message });
  }
});

// Get top selling products
router.get('/top-products', async (req, res) => {
  try {
    // Since we now have order items correctly modeled in MongoDB, we can actually calculate this!
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      { $group: {
          _id: "$items.product_id",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
      }},
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      { $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
      }},
      { $unwind: "$productDetails" },
      { $project: {
          _id: 1,
          totalSold: 1,
          revenue: 1,
          name: "$productDetails.name",
          price: "$productDetails.price",
          image: "$productDetails.image"
      }}
    ]);

    res.json(topProducts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching top products', error: err.message });
  }
});

// Get order status distribution
router.get('/order-status', async (req, res) => {
  try {
    const distribution = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { _id: 0, status: "$_id", count: 1 } }
    ]);
    res.json(distribution);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching status distribution', error: err.message });
  }
});

export default router;
