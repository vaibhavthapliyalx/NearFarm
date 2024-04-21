/**
 * @fileoverview This file contains the orders table component which is render under the tab
 * "My Orders" in the profile page.
 */

'use client';

// Imports
import ApiConnector from "@/app/services/ApiConnector";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useEffect, useState } from "react";
import { TableHead, TableRow, TableHeader, Table, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ToastType } from "@/shared/constants";
import { Order, OrderItem } from "@/shared/interfaces";
import { Select } from "./ui/select";
import { Badge } from "./ui/badge";

// Interface for the props of the orders table component.
interface IProps {
  userId: string;
}
// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * This function renders the orders table component.
 * 
 * @param {any} params The id param object passed to the component.
 * @returns The rendered orders table component.
 */
export default function OrdersTable({userId}: IProps) {

  // State variables.
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Get the router instance.
  const router = useRouter();

  // Grabs the toast function from the useToast hook.
  const { toast } = useToast();

  // This is called when the component is rendered and when the user's id changes.
  useEffect(() => {
    fetchData();
  }, [userId]);

  /**
   * This function fetches the user's previous orders.
   * 
   * @returns void
   */
  async function fetchData() {
    if (userId) {
      const response = await apiConnectorInstance.getPrevOrders(userId);
      if (response.success) {
        setOrders(response.data);
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: ToastType.DESTRUCTIVE,
        });
      }
    }
  }

  // If the order is empty, render the empty order component.
  if (orders.length === 0) {
    return (
      <MaxWidthWrapper>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="flex flex-col items-center gap-4">
          <ShoppingBag
              size={80}
              className="text-dark-3"
          />
            <h1 className="font-semibold text-2xl md:text-3xl">No Previous Orders</h1>
            <Link href="/products">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    );
  }

  /******************** Render Function *****************/
  return (
    <MaxWidthWrapper>
      <div className="grid gap-6 p-6">
        <div className="border shadow-sm rounded-lg">
          <Table className="min-w-full overflow-auto">
            <TableHeader>
              <TableRow className="m-4">
                <TableHead className="p-4"> Order #</TableHead>
                <TableHead className="p-4"> Placed On </TableHead>
                <TableHead className="p-4"> Status </TableHead>
                <TableHead className="p-4"> Last Updated </TableHead>
                <TableHead className="p-4"> Items </TableHead>
                <TableHead className="p-4"> Total </TableHead>
              </TableRow>
            </TableHeader>
            {orders.map((order, index) => (
              <TableBody key={index} onClick={() => router.push(`/order/confirmation/${order.id}`)}>
                <TableRow className="m-4 hover:cursor-pointer">
                  <TableCell className="p-4">{index+1}</TableCell>
                  <TableCell className="p-4">{new Date(order.placedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                  <TableCell className="p-4">{order.status}</TableCell>
                  <TableCell className="p-4">{new Date(order.updatedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                  <TableCell className="p-4">{order.items.map((item, index) => {
                    return (
                      <div key={index} className="light:text-gray-500 mb-2">
                        {item.productName} <Badge className="ml-2">x{item.quantity}</Badge>
                      </div>
                    )
                  })}</TableCell>
                  <TableCell className="p-4">£{order.orderTotal}</TableCell>
                </TableRow>
                
              </TableBody>
            ))}
          </Table>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}