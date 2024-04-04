/**
 * @fileoverview This file contains the API routes for the cart.
 */

import { connectDB } from "@/lib/database";
import User from "@/lib/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    const user_id = request.nextUrl.searchParams.get('user_id');


    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "No user found"
        }
      });
    }

    // Get the cart items
    const cart = user.cart;
    if(!cart) {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "Cart is empty"
        }
      });
    }
    return NextResponse.json({
      status: 200,
      body: {
        success: true,
        message: "Cart items found",
        data: cart
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: 'An error occurred while fetching the cart items',
        error: error
      }
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    const body = await request.json();
    const user_id = body.userId;
    const product_id = body.productId;
    const quantity = body.quantity;
    const name = body.name;
    const price = body.price;
    const image = body.image;

    let user = await User.findOne({ _id: user_id });
    if (!user) {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "No user found"
        }
      });
    }
    // Check if the same product already exists. If it does, increment the quantity.
    const existingProduct = user.cart.find((item: { productId: any; }) => item.productId === product_id);
    if (existingProduct) {
      if (existingProduct.quantity + quantity > 20) {
        return NextResponse.json({
          status: 400,
          body: {
            success: false,
            message: "Quantity limit reached. Cannot add more than 20 items of the same product."
          }
        });
      }
      // If the quantity is less than 20, increment the quantity.
      await User.updateOne({ _id: user_id, "cart.productId": product_id }, { 
        $inc: { "cart.$.quantity": quantity }
      });
      return NextResponse.json({
        status: 200,
        body: {
          success: true,
          message: "Same product already exists. Quantity incremented successfully."
        }
      });
    }

    // Update the cart items
    await User.updateOne({ _id: user_id }, { 
      $push: {cart: 
        {productId: product_id, 
         quantity: quantity, 
         name: name, 
         price: price, 
         image: image 
        }
      } 
    });

    // Fetch the user again to get the updated cart.
    user = await User.findOne({ _id: user_id }); 
    return NextResponse.json({
      status: 200,
      body: {
        success: true,
        message: "Added item to cart",
        data: user.cart
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: 'An error occurred while adding the item to the cart',
        error: error
      }
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    const user_id = request.nextUrl.searchParams.get('userId');
    const product_id = request.nextUrl.searchParams.get('productId');
    console.log(user_id, product_id);

    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "No user found"
        }
      });
    }

    // Update the cart items
    await User.updateOne({ _id: user_id }, { 
      $pull: {cart: {productId: product_id} }
    });

    return NextResponse.json({
      status: 200,
      body: {
        success: true,
        message: "Cart items updated",
        data: user.cart
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: 'An error occurred while updating the cart items',
        error: error
      }
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    const body = await request.json();
    const user_id = body.userId;
    const product_id = body.productId;
    const quantity = body.quantity;

    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "No user found"
        }
      });
    }

    // Update the cart items
    await User.updateOne({ _id: user_id, "cart.productId": product_id }, { 
      $set: {"cart.$.quantity": quantity }
    });

    return NextResponse.json({
      status: 200,
      body: {
        success: true,
        message: "Cart items updated",
        data: user.cart
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: 'An error occurred while updating the cart items',
        error: error
      }
    });
  }
}