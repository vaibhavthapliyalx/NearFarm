/**
 * @fileoverview This file contains the model for the product.
 * This model is used to define the product schema and the products.
 */
import { Schema, model, models, mongo } from 'mongoose';

const ProductSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  name: {
    type: Schema.Types.String,
    required: [true, 'Product name is required'],
  },
  description: {
    type: Schema.Types.String,
    required: false,
  },
  sale_price:{
    type: Schema.Types.Number,
    required: [true, 'Product sale price is required'],
  },
  market_price: {
    type: Schema.Types.Number,
    required: [true, 'Product market price is required'],
  },
  quantity: {
    type: Schema.Types.Number,
    required: [true, 'Product quantity is required'],
  },
  image: {
    type: Schema.Types.String,
    required: false,
  },
  catalogue: {
    type: [Schema.Types.String],
    required: false,
  },
  seller_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Product seller ID is required'],
  },
  available_from: {
    type: Date,
    required: [true],
    default: Date.now,
  },
  listed_at: {
    type: Date,
    required: [true],
    default: Date.now,
  },
  collection_address: {
    type: Schema.Types.String,
    required: [false, 'Product collection address is required'],
  },
  category: {
    type: Schema.Types.String,
    required: [true, 'Product category is required'],
  },
  notes: {
    type: Schema.Types.String,
    required: false,
  },
  rating: {
    type: Schema.Types.Number,
    required: false,
    default: 5,
  },
  soldTillDate: {
    type: Schema.Types.Number,
    required: false,
    default: 0,
  },
});

const Product = models.Product || model('Product', ProductSchema);

export default Product;