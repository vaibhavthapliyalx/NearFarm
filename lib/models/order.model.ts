/**
 * @fileoverview This file contains the schema for the order.
 */

// Imports.
import { OrderStatus } from '@/shared/constants';
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      productName: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      orderPrice: { type: Number, required: true, min: 0 }
    }
  ],
  status: { type: String, required: true, enum: OrderStatus, default: OrderStatus.PENDING },
  placedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now},
  orderTotal: { type: Number, required: true, min: 0 }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);