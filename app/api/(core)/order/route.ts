/**
 * @fileoverview This file conatins the routes for the order API.
 */
import { connectDB } from "@/lib/database";
import Order from "@/lib/models/order.model";
import User from "@/lib/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const orderId = request.nextUrl.searchParams.get('orderId');
    // Connect to MongoDB
    await connectDB();

    // Convert the id in the query string to ObjectId.
    const uid = new mongoose.Types.ObjectId(userId!);
    const oid = new mongoose.Types.ObjectId(orderId!);

    let query = {};

    let order;

    if (orderId) {
      query = { _id: oid };
      order = await Order.findOne(query);
    } else if (userId) {
      query = { userId: uid };
      order = await Order.find(query);
    }

    if (order) {
      return NextResponse.json({
        status: 200,
        body: {
          success: true,
          message: "Order found",
          data: order
        }
      })
    } else {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "Order not found"
        }
      })
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: "An error occurred while fetching the order",
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
    const userId = body.userId;
    const orderItems = body.orderItems;

    // Check if an order with the same userId and items already exists
    const existingOrder = await Order.findOne({ userId: userId, items: orderItems });
    if (existingOrder) {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "Order already exists"
        }
      });
    }

    // Add the order to the database.
    const order = await Order.create({
      userId: userId,
      items: orderItems,
      orderTotal: orderItems.reduce((acc: number, item: any) => acc + item.orderPrice, 0)
    });

    if (!order) {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "Order not created"
        }
      });
    }

    // Clear the cart for the user on successful order creation.
    const cartUpdated = await User.updateOne({ _id: userId }, { cart: [] });

    if (!cartUpdated) {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "Something went wrong while clearing the cart. Order not placed."
        }
      });
    }
    return NextResponse.json({
      status: 200,
      body: {
        success: true,
        message: "Order created successfully",
        data: order
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: "An error occurred while creating the order",
        error: error
      }
    });
  }
}
