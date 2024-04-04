// /**
//  * @fileoverview This file contains the API routes for the order.
//  */

// import { connectDB } from "@/lib/database";
// import Order from "@/lib/models/order.model";
// import Cart from "@/lib/models/cart.model";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   try {
//     // Connect to MongoDB
//     await connectDB();

//     const id = request.nextUrl.searchParams.get('id');
//     const user_id = request.nextUrl.searchParams.get('user_id');

//     let query = {};
//     if (id) {
//       query = { ...query, _id: id };
//     }
//     if (user_id) {
//       query = { ...query, user_id: user_id };
//     }
//     // Find the order based on the query.
//     const order = await Order.findOne(query);
//     if (order) {
//       return NextResponse.json({
//         status: 200,
//         body: {
//           success: true,
//           message: "Order found",
//           data: order
//         }
//       });
//     } else {
//       return NextResponse.json({
//         status: 400,
//         body: {
//           success: false,
//           message: "No order found"
//         }
//       });
//     }
//   } catch (error) {
//     return NextResponse.json({
//       status: 500,
//       body: {
//         success: false,
//         message: 'An error occurred while fetching the order',
//         error: error
//       }
//     });
//   }
// }

// export async function POST(request: NextRequest) {
//   // Connect to MongoDB
//   await connectDB();
//   const body = await request.json();

//   try {
//     const order = new Order(body);
//   await order.save();

//   // After order is placed, remove the items from the cart.
//   const cart = await Cart.findOne({ user_id: order.user });
//   if (cart) {
//     cart.items.forEach((item) => {
//       if (order.items.includes(item.id)) {
//         cart.items = cart.items.filter((cartItem) => cartItem.id !== item.id) as typeof Cart.prototype.items;
//       }
//     });
//     await cart.save();
//   }

//   return NextResponse.json({
//     status: 200,
//     body: {
//       success: true,
//       message: "Order created",
//       data: order
//     }
//   });
//   } catch (error) {
//     return NextResponse.json({
//       status: 500,
//       body: {
//         success: false,
//         message: "An error occurred while creating the order",
//         error: error
//       }
//     });
//   }
// }

// export async function PUT(request: NextRequest) {
//   // Connect to MongoDB
//   await connectDB();
//   const body = await request.json();

//   const id = body.id;
//   const status = body.status;

//   const order = await Order.findOne({ _id: id });
//   if (order) {
//     order.status = status;
//     await order.save();
//     return NextResponse.json({
//       status: 200,
//       body: {
//         success: true,
//         message: "Order updated",
//         data: order
//       }
//     });
//   } else {
//     return NextResponse.json({
//       status: 400,
//       body: {
//         success: false,
//         message: "No order found"
//       }
//     });
//   }
// }

// export async function DELETE(request: NextRequest) {
//   // Connect to MongoDB
//   await connectDB();
//   const body = await request.json();

//   const id = body.id;

//   const order = await Order.findOne({ _id: id });
//   if (order) {
//     await order.deleteOne();
//     return NextResponse.json({
//       status: 200,
//       body: {
//         success: true,
//         message: "Order deleted"
//       }
//     });
//   } else {
//     return NextResponse.json({
//       status: 400,
//       body: {
//         success: false,
//         message: "No order found"
//       }
//     });
//   }
// }