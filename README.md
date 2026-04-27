# Urban Hub Shoes - Premium eCommerce Platform

A modern, high-performance eCommerce website with customer frontend and admin dashboard built with Next.js, MongoDB, and Tailwind CSS.

## Features

### Customer Website
- **Home Page**: Hero section, featured products, trending items, brand story
- **Shop**: Product listing with filters (category, price, search)
- **Product Detail**: Size selection, quantity picker, WhatsApp order
- **Checkout**: Cash on Delivery (COD) with customer details form
- **Mobile Responsive**: Fully responsive design for all devices
- **Animations**: Smooth Framer Motion animations throughout

### Admin Panel
- **Secure Login**: JWT-based authentication
- **Dashboard**: Statistics overview and quick actions
- **Product Management**: Add, edit, delete products
- **Order Management**: View orders, update status, delete orders
- **Analytics**: Sales charts, best-selling products, revenue tracking

### WhatsApp Integration
- Orders automatically generate WhatsApp messages
- Pre-filled order details sent to admin
- One-click ordering for customers

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: Sonner (toast)

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)

### Installation

1. **Clone and navigate to the project:**
```bash
cd urban-hub-shoes
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create `.env.local` file:
```env
MONGODB_URI=mongodb://localhost:27017/urban-hub-shoes
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_WHATSAPP=1234567890
NEXTAUTH_URL=http://localhost:3000
```

4. **Set up the database:**
Make sure MongoDB is running locally or use MongoDB Atlas for cloud database.

5. **Create initial admin user:**
Run this script to create an admin user (or use the API):
```javascript
// POST to /api/auth/login with admin credentials
// Default: username: "admin", password: "admin123"
```

6. **Start development server:**
```bash
npm run dev
```

7. **Open browser:**
- Customer Website: http://localhost:3000
- Admin Panel: http://localhost:3000/admin/login

## Project Structure

```
urban-hub-shoes/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/              # API Routes
│   │   │   ├── analytics/    # Analytics endpoint
│   │   │   ├── auth/         # Authentication
│   │   │   ├── orders/       # Orders CRUD
│   │   │   └── products/     # Products CRUD
│   │   ├── admin/            # Admin Panel
│   │   │   ├── login/        # Admin login
│   │   │   ├── dashboard/    # Dashboard home
│   │   │   ├── products/     # Product management
│   │   │   ├── orders/       # Order management
│   │   │   └── analytics/    # Analytics & charts
│   │   ├── checkout/         # Checkout page
│   │   ├── product/          # Product detail
│   │   ├── shop/             # Shop page
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── Navbar.tsx        # Navigation
│   │   ├── Hero.tsx          # Hero section
│   │   ├── FeaturedProducts.tsx
│   │   ├── TrendingProducts.tsx
│   │   ├── BrandStory.tsx
│   │   └── Footer.tsx
│   ├── lib/                  # Utilities
│   │   ├── db.ts            # MongoDB connection
│   │   └── auth.ts          # Auth utilities
│   ├── models/               # Mongoose models
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   └── Admin.ts
│   └── types/                # TypeScript types
│       └── index.ts
├── .env.local               # Environment variables
├── next.config.js           # Next.js config
├── tailwind.config.ts       # Tailwind config
└── package.json
```

## Admin Credentials (Demo)

- **Username**: `admin`
- **Password**: `admin123`

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/urban-hub-shoes
JWT_SECRET=your-production-secret-key
ADMIN_WHATSAPP=your-whatsapp-number
NEXTAUTH_URL=https://your-domain.vercel.app
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get single order
- `PUT /api/orders/[id]` - Update order status
- `DELETE /api/orders/[id]` - Delete order

### Auth
- `POST /api/auth/login` - Admin login

### Analytics
- `GET /api/analytics` - Dashboard statistics

## Customization

### Change Brand Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    // Your custom colors
  }
}
```

### Update WhatsApp Number
Edit `.env.local`:
```env
ADMIN_WHATSAPP=your-number-with-country-code
```

### Add More Categories
Edit `src/models/Product.ts` and update the category enum.

## Features to Add

- [ ] Image upload (Cloudinary/AWS S3)
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Payment gateway integration
- [ ] Inventory management
- [ ] Customer reviews
- [ ] Wishlist functionality
- [ ] Order tracking

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For support, email support@urbanhub.com or open an issue.

---

Built with ❤️ by Urban Hub Team
