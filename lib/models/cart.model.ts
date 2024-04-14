/**
 * @fileoverview This file contains the schema for the cart item.
 */

// Imports.
import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true},
  quantity: { 
    type: Number, 
    required: true, 
    validate: {
      validator: function(v: number) {
        return v <= 20;
      },
      message: (props: { value: any; }) => `Quantity ${props.value} exceeds limit of 20`
    }
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }
});

export default CartItemSchema;