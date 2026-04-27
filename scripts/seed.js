const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/urban-hub-shoes');
    console.log('Connected to MongoDB');

    // Create Admin
    const adminSchema = new mongoose.Schema({
      username: String,
      password: String,
    });
    const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
    
    await Admin.deleteOne({ username: 'admin' });
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({ username: 'admin', password: hashedPassword });
    console.log('Admin user created: admin / admin123');

    // Create Products
    const productSchema = new mongoose.Schema({
      name: String,
      price: Number,
      description: String,
      images: [String],
      sizes: [String],
      category: String,
      stock: Number,
      featured: Boolean,
      trending: Boolean,
    }, { timestamps: true });
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
    
    await Product.deleteMany({});
    
    const products = [
      {
        name: 'Urban Runner Pro',
        price: 149,
        description: 'High-performance running shoes with advanced cushioning technology. Designed for comfort and speed.',
        images: [],
        sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11'],
        category: 'running',
        stock: 25,
        featured: true,
        trending: true,
      },
      {
        name: 'Street Style Classic',
        price: 129,
        description: 'Versatile casual sneakers perfect for everyday wear. Premium materials for lasting comfort.',
        images: [],
        sizes: ['7', '8', '9', '10', '11'],
        category: 'casual',
        stock: 30,
        featured: true,
      },
      {
        name: 'Executive Elite',
        price: 199,
        description: 'Premium formal shoes crafted with genuine leather. Perfect for business and special occasions.',
        images: [],
        sizes: ['7', '8', '9', '10', '11', '12'],
        category: 'formal',
        stock: 15,
        featured: true,
      },
      {
        name: 'Sport Max Ultra',
        price: 179,
        description: 'All-purpose sports shoes with enhanced grip and durability. Built for the active lifestyle.',
        images: [],
        sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '11'],
        category: 'sports',
        stock: 20,
        trending: true,
      },
      {
        name: 'Winter Explorer',
        price: 249,
        description: 'Warm, waterproof winter boots with anti-slip soles. Ready for any weather condition.',
        images: [],
        sizes: ['7', '8', '9', '10', '11', '12'],
        category: 'boots',
        stock: 10,
      },
      {
        name: 'Summer Breeze',
        price: 89,
        description: 'Lightweight and breathable summer sandals. Comfortable for all-day wear.',
        images: [],
        sizes: ['6', '7', '8', '9', '10', '11'],
        category: 'sandals',
        stock: 35,
        trending: true,
      },
    ];
    
    await Product.insertMany(products);
    console.log(`Created ${products.length} products`);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
