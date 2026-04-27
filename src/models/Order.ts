import mongoose, { Schema, model, models } from 'mongoose';
import { Order as OrderType } from '@/types';

const OrderSchema = new Schema<OrderType>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Please provide a product'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: [true, 'Please provide total price'],
      min: [0, 'Total price cannot be negative'],
    },
    customerName: {
      type: String,
      required: [true, 'Please provide customer name'],
    },
    customerPhone: {
      type: String,
      required: [true, 'Please provide customer phone'],
    },
    customerAddress: {
      type: String,
      required: [true, 'Please provide customer address'],
    },
    status: {
      type: String,
      enum: ['pending', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default models.Order || model<OrderType>('Order', OrderSchema);
