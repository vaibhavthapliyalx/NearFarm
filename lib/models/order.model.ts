/**
 * @fileoverview This file contains the schema for the order.
 */

// Imports.
import { OrderStatus } from '@/shared/constants';
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  status: { type: String, required: true, enum: OrderStatus, default: OrderStatus.PENDING },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

export default mongoose.model('Order', OrderSchema);