import mongoose, { Schema, model, models } from 'mongoose';
import { Product as ProductType } from '@/types';

const ProductSchema = new Schema<ProductType>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one image'],
    },
    sizes: {
      type: [String],
      required: [true, 'Please provide available sizes'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['running', 'casual', 'formal', 'sports', 'boots', 'sandals'],
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Product || model<ProductType>('Product', ProductSchema);
