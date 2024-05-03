/**
 * @fileoverview This file conatins the routes for the order API.
 */
import NewOrderEmail from "@/components/emails/new-order.email";
import OrderConfirmationEmail from "@/components/emails/order-confirmation.email";
import OrderUpdateEmail from "@/components/emails/order-update.email";
import { connectDB } from "@/lib/database";
import Order from "@/lib/models/order.model";
import Product from "@/lib/models/product.model";
import User from "@/lib/models/user.model";
import { sendEmail } from "@/lib/nodemailer/mail";
import { render } from "@react-email/render";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    const orderId = request.nextUrl.searchParams.get('orderId');
    const sellerId = request.nextUrl.searchParams.get('sellerId');
    // Connect to MongoDB
    await connectDB();

    // Convert the id in the query string to ObjectId.
    const uid = new mongoose.Types.ObjectId(userId!);
    const oid = new mongoose.Types.ObjectId(orderId!);
    const sid = new mongoose.Types.ObjectId(sellerId!);

    let query = {};

    let order;

    if (orderId) {
      query = { _id: oid };
      order = await Order.findOne(query);
    } else if (userId) {
      query = { userId: uid };
      order = await Order.find(query).sort({ _id: -1 });
    } else if (sellerId) {
      query = { "items.sellerId": sid };
      order = await Order.find(query).sort({ _id: -1 });
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
    let order;

    // Group the items by seller
    const groupedItems = orderItems.reduce((acc: any, item: any) => {
      (acc[item.sellerId] = acc[item.sellerId] || []).push(item);
      return acc;
    }, {});

    // For each group, create a new order
    for (const sellerId in groupedItems) {
      // Check if an order with the same userId and items already exists
      const existingOrder = await Order.findOne({ userId: userId, items: groupedItems[sellerId] });
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
      order = await Order.create({
        userId: userId,
        items: groupedItems[sellerId],
        orderTotal: groupedItems[sellerId].reduce((acc: number, item: any) => acc + item.orderPrice, 0)
      });

      const user = await User.findOne({ _id: userId});
      const seller = await User.findOne({ _id: order.items[0].sellerId});

      // Send an email notification to the seller for the order.
      try {
        const html = render(NewOrderEmail({
          params: {
            name: seller.name,
            order: order,
            email: seller.email,
          }
        }));
        await sendEmail(seller.email,"You have a new order", html);
      } catch(error) {
        return NextResponse.json({
            status: 500,
            body: {
              success: false,
              message: "Could not send the order email to the seller. Please try again later.",
              error: error,
            },
        });
      }

      // After the seller has been notified, send an email to the user for the order confirmation.
      try {
        const html = render(OrderConfirmationEmail({
          params: {
            name: user?.name,
            order: order,
            email: user?.email
          }
        }));

        // Sending email using nodemailer to the user.
        await sendEmail(user.email,"Your order is confirmed", html);
      } catch(error) {
        return NextResponse.json({
            status: 500,
            body: {
              success: false,
              message: "Could not send the order confirmation email. Please try again later.",
              error: error,
            },
        });
      }

      if (!order) {
        return NextResponse.json({
          status: 400,
          body: {
            success: false,
            message: "Order not created"
          }
        });
      }
    }

    // After the order has been placed update the sold quantity for each product.
    // This is done by incrementing the sold quantity by the quantity ordered.
    orderItems.forEach(async (item: any) => {
      await Product.updateOne({ _id: item.productId }, { $inc: { soldTillDate: item.quantity } });
    });

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

    // After clearing the card, add the price of the order to the user's total spent.
    const updatedUser = await User.updateOne({ _id: userId }, { $inc: { totalSpent: order.orderTotal } });

    if (!updatedUser) {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "Something went wrong while updating the user's total spent. Order not placed."
        }
      });
    }
    
    return NextResponse.json({
      status: 200,
      body: {
        success: true,
        message: "Order created successfully. Please check your email for the order confirmation.",
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

export async function PUT(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();
    const body = await request.json();
    const orderId = body.orderId;
    const status = body.status;
    const order = await Order.findOneAndUpdate(
      { _id: orderId }, 
      { status: status, updatedAt: new Date()}, 
      { new: true }
    );
    const user = await User.findOne({ _id: order?.userId });
    const seller = await User.findOne({ _id: order.items[0].sellerId});

    // Send the email to the user
    try {
      const html = render(OrderUpdateEmail({
        params: {
          name: user?.name,
          order: order,
          email: user?.email,
          status: status,
          sellerName: seller?.name
        }
      }));

      // Sending email using nodemailer to the user.
      await sendEmail(user.email,"We have an update on your order", html);
    } catch(error) {
      return NextResponse.json({
          status: 500,
          body: {
            success: false,
            message: "Couldn't send the order update email to the user. Please try again later.",
            error: error,
          },
      });
    }

    if (order) {
      return NextResponse.json({
        status: 200,
        body: {
          success: true,
          message: "Order status updated successfully. Notification has been sent to the user via email.",
          data: order
        }
      });
    } else {
      return NextResponse.json({
        status: 400,
        body: {
          success: false,
          message: "Order not found"
        }
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: {
        success: false,
        message: "An error occurred while updating the order status",
        error: error
      }
    });
  }
}
