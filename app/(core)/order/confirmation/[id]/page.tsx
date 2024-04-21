/**
 * @fileoverview This file contains the OrderPage component.
 */
'use client';
import { CardTitle, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircleIcon } from "lucide-react"
import ApiConnector from "@/app/services/ApiConnector"
import { useEffect, useState } from "react";
import { Order } from "@/shared/interfaces";

// Interface for the props of the OrderPage component.
interface IProps {
  params: any;
}

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * This function renders the OrderPage component.
 * 
 * @param {any} params The id param object passed to the component.
 * @returns The rendered OrderPage component.
 */
export default function OrderPage({params}: IProps) {
  const [order, setOrder] = useState<Order>({} as Order);
  const orderId = params.id;

  /**
   * This function fetches the order data from the server when the component is mounted.
   */
  useEffect(() => {
    function fetchOrder() {
      apiConnectorInstance.getOrderByID(orderId)
      .then(response => {
        console.log(response.data);
        setOrder(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    }
    fetchOrder();
  }, [orderId]);

  /***************** Render Function ****************/
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-inherit">
      <Card className="w-full max-w-md px-4 py-6 md:p-8 bg-inherit border-primary">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Order Confirmation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <CheckCircleIcon className="w-16 h-16 text-green-500" />
            <p className="light:text-gray-600">
              Thank you for your purchase! Your order is now being processed and will be shipped soon.
            </p>
          </div>
          <div className="grid gap-4 mt-8">
            <div className="grid gap-2">
              <h2 className="font-semibold light:text-gray-600">Order Details</h2>
              {order.items?.map((item, index) => {
                  return (
                    <p key={index} className="light:text-gray-500">
                      {item.productName} <Badge className="ml-2">x{item.quantity}</Badge>
                    </p>
                  )
              })}
            </div>
            <div className="grid gap-2">
              <h2 className="font-semibold light:text-gray-600">Total Amount</h2>
              <p className="light:text-gray-500">£{order.orderTotal}</p>
            </div>
            <div className="grid gap-2">
              <h2 className="font-semibold light:text-gray-600"> Order Placed on</h2>
              <p className="light:text-gray-500">{new Date(order.placedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="grid gap-2 items-center">
              <h2 className="font-semibold light:text-gray-600 mr-4">Order Status</h2>
              <Badge className="w-[80px]">{order.status}</Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center mt-8">
          <Link className="w-full" href="/">
            <Button className="w-full">Return to Home Page</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}