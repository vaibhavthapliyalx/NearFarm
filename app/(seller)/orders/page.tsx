/**
 * @fileoverview This file contains the page for the seller orders.
 * This page allows the seller to view and manage their orders.
 * 
 * Note: This route is middleware protected and only accessible to sellers.
 */

'use client';

// Imports
import ApiConnector from "@/app/services/ApiConnector";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { TableHead, TableRow, TableHeader, Table, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import { Order, User } from "@/shared/interfaces";
import { Frown, MoreHorizontal, Plus, XIcon } from "lucide-react";
import LoadingSpinner from "@/components/LoadingAnimations/LoadingSpinner";
import { useToast } from "@/components/ui/use-toast";
import { OrderMethod, OrderStatus, ToastType } from "@/shared/constants";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const apiConnectorInstance = ApiConnector.getInstance();

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customer, setCustomer] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  /**
   * This function fetches the orders for the seller.
   */
  async function fetchOrders() {
    setLoading(true);
    try {
      // Since this page is only accessible to sellers, we can get the seller id from the session.
      const sellerId = (await apiConnectorInstance.getCurrentUserFromSession()).id;
      // const response = await apiConnectorInstance.getOrdersForSeller("661cfd5d21a6a92243601107");
      const response = await apiConnectorInstance.getOrdersForSeller(sellerId);
      if (!response.success) {
        toast({
          title: "Error",
          description: response.message,
          variant: ToastType.DESTRUCTIVE
        });
        return;
      }
      setOrders(response.data);

      // After fetching the orders, we can fetch the customer details.
      response.data.forEach(async (order: Order) => {
        const response = await apiConnectorInstance.getUserFromId(order.userId);
        setCustomer((prev) => [...prev, response.data]);
      });
      
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: ToastType.DESTRUCTIVE
      })
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [])

  /**
   * This function updates the status of an order.
   * 
   * @param orderId The id of the order.
   * @param status The new status of the order.
   */
  async function handleOrderStatusChange(orderId: string, status: OrderStatus) {
    try {
      const res = await apiConnectorInstance.updateOrder(orderId, status);
      if (!res.success) {
        toast({
          title: "Error",
          description: res.message,
          variant: ToastType.DESTRUCTIVE
        });
      } else {
        // After successfully updating the order status, we can refetch the orders asynchrounously.
        await fetchOrders();
        toast({
          title: "Success",
          description: res.message,
          variant: ToastType.SUCCESS
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: ToastType.DESTRUCTIVE
      });
    }
  }

  /**
   * This function renders the user actions.
   * This includes the modify and delete actions.
   * 
   * @param orderId The id of the order.
   * @returns The rendered user actions.
   */
  function renderUserActions(orderId: string): React.ReactNode {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className='overflow-hidden'
          >
            <MoreHorizontal size={24} className="text-gray-500 ml-2 dark:text-gray-200 dark:hover:text-primary hover:text-primary hover:cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='bg-white rounded-lg shadow dark:bg-gray-900'
          align='end'>
            <div className='flex items-center justify-start gap-2 p-2'>
              <div className='flex flex-col space-y-0.5 leading-none'>
                <p className='block  text-sm text-gray-900  dark:text-white '>
                  Order Status
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
              {Object.values(OrderStatus).map((status, index) => {
                return (
                  <DropdownMenuItem role="button"
                  className='cursor-pointer block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white'
                  key={index}
                  onClick={()=> handleOrderStatusChange(orderId, status as OrderStatus)}
                  >
                    {status}
                  </DropdownMenuItem>
                )
              })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

    // If the order is empty, render the empty order component.
  if (orders.length === 0) {
    return (
      <MaxWidthWrapper>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <Frown
              size={80}
              className="text-dark-3"
            />
            <h1 className="font-semibold text-2xl md:text-3xl">
              {"You haven't received any orders yet"}
            </h1>
            <h1 className="font-semibold text-2xl md:text-3xl">
              {"Check back soon!"}
            </h1>
          </div>
        </div>
      </MaxWidthWrapper>
    );
  }

  return (
    <MaxWidthWrapper>
      <LoadingSpinner display={loading} message="Searching for your orders. Hang tight..." />
      <div className="grid gap-6 p-6">
        <h1 className="font-semibold text-2xl md:text-3xl">My Orders</h1>
        <div className="border shadow-sm rounded-lg overflow-auto">
        <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Order #</TableHead>
                <TableHead className="w-30">Ordered </TableHead>
                <TableHead className="flex-grow ">Customer</TableHead>
                <TableHead className="w-30">Location</TableHead>
                <TableHead className="w-30">Last Updated</TableHead>
                <TableHead className="w-30">Product</TableHead>
                <TableHead className="w-30">Mode of Order Fulfilment</TableHead>
                <TableHead className="w-30">Total</TableHead>
                <TableHead className="w-[60px]"> Status </TableHead>
                <TableHead className="w-[60px]"> Action </TableHead>
              </TableRow>
            </TableHeader>
            {orders.map((order, index) => (
              <TableBody key={index} className="hover:bg-inherit">
                <TableRow className="m-4 hover:cursor-pointer">
                  <TableCell className="p-4">{index+1}</TableCell>
                  <TableCell className="p-4">{formatDistanceToNow(order.placedAt,{addSuffix: true})}</TableCell>
                  <TableCell className="p-4">{customer[index] ?  customer[index].name : "Loading..."}</TableCell>
                  <TableCell className="p-4">{customer[index] ? customer[index].contactDetails.address : "Loading..."}</TableCell>
                  <TableCell className="p-4">{formatDistanceToNow(order.updatedAt,{addSuffix: true})}</TableCell>
                  <TableCell className="p-4">{order.items.map((item, index) => {
                    return (
                      <div key={index} className="light:text-gray-500 mb-2 flex-row">
                        <Button variant={'link'} onClick={()=> router.push(`/products/${item.productId}`)}>
                        {item.productName} 
                        </Button>
                        <Badge className="ml-2">x{item.quantity}</Badge>
                      </div>
                    )
                  })}</TableCell>
                  <TableCell className="p-4">{OrderMethod.COLLECT}</TableCell>
                  <TableCell className="p-4">£{order.orderTotal}</TableCell>
                  <TableCell className="p-4">
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {renderUserActions(order.id)}
                </TableCell>
                </TableRow>
                
              </TableBody>
            ))}
          </Table>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}