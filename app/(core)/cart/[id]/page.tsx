/**
 * @fileoverview This file contains the cart page component.
 */

'use client';

// Imports
import ApiConnector from "@/app/services/ApiConnector";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { CartItem, OrderItem, User } from "@/shared/interfaces";
import { useEffect, useState } from "react";
import { TableHead, TableRow, TableHeader, Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button"
import CartItemComponent from "@/components/CartItemComponent";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ToastType } from "@/shared/constants";
import LoadingSpinner from "@/components/LoadingAnimations/LoadingSpinner";
import { set } from "mongoose";

// Interface for the props of the CartPage component.
interface IProps {
  params: any;
}
// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * This function renders the cart page component.
 * 
 * @param {any} params The id param object passed to the component.
 * @returns The rendered cart page component.
 */
export default function CartPage({params}: IProps) {
  // Grab the id from the route url.
  const userId = params.id;
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Fetching cart items...");
  
  // Get the router instance.
  const router = useRouter();
  // Grabs the toast function from the useToast hook.
  const { toast } = useToast();

  // This is called when the component is rendered and when the user's id changes.
  useEffect(() => {
    fetchData()
  }, [userId]);

  /**
   * This function fetches the user's cart data from the server.
   */
  async function fetchData() {
    try {
      const response = await apiConnectorInstance.getUserFromId(userId);
      const user: User = response.data;    
      // Now we have the user object, we can set the cart items.
      setCartItems(user.cart);
    } finally {
      setLoading(false);
    }
  }

  /**
   * This function is called when the quantity of an item is changed.
   * 
   * @param quantity The new quantity of the item.
   * @param productId The id of the product.
   */
  function onQuantityChange(quantity: number, productId: string) {
    apiConnectorInstance.updateCartItem(userId, productId ,quantity)
    .then((response) => {
      toast({
        title: "Success",
        description: response.message,
        variant: ToastType.DEFAULT,
      })
    })
    .catch((response) => {
      toast({
        title: "Error",
        description: response.message,
        variant: ToastType.DESTRUCTIVE,
      })
    })
    .finally(() => {
      fetchData();
    });
  }

  /**
   * This function is called when an item is removed from the cart.
   * 
   * @param productId The id of the product.
   */
  function onItemRemove(productId: string) {
    apiConnectorInstance.removeItemFromCart(userId, productId)
    .then((response) => {
      toast({
        title: "Success",
        description: response.message,
        variant: ToastType.DEFAULT,
      })
    })
    .catch((response) => {
      toast({
        title: "Error",
        description: response.message,
        variant: ToastType.DESTRUCTIVE,
      })
    })
    .finally(() => {
      fetchData();
    });
  }

  // If the cart is empty, render the empty cart component.
  if (cartItems.length === 0 && !loading) {
    return (
      <MaxWidthWrapper>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="flex flex-col items-center gap-4">
          <ShoppingBag
              size={80}
              className="text-dark-3"
          />
            <h1 className="font-semibold text-2xl md:text-3xl">Your cart is empty</h1>
            <Link href="/products">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    );
  }

  /**
   * This function is called when the user clicks on the place order button.
   */
  function placeOrder() {
    // Display a simulation of the order placement.
    setLoading(true);
    setMessage("Requesting to place the order...");

    // After a delay of one second, display getting card details.
    setTimeout(() => {
      setMessage("Getting card details...");

      // After another delay of one second, display contacting card issuer.
      setTimeout(() => {
        setMessage("Contacting Card Issuer...");

      // After another delay of one second, display processing payment.
      setTimeout(() => {
        setMessage("Processing payment...");

          // After another delay of one second, display payment approved.
          setTimeout(() => {
            setMessage("Payment Approved !");

            setTimeout(() => {
              setMessage("Verifying Order and Seller Details...");
              setTimeout(() => {
                setMessage("Validation Successful ! Placing Order Now...");
                setTimeout(() => {
                  const orderItems: OrderItem[] = cartItems.map((item) => {
                    return {
                      productId: item.productId,
                      sellerId: item.sellerId,
                      quantity: item.quantity,
                      productName: item.name,
                      productImage: item.image,
                      orderPrice: (item.price * item.quantity),
                    }
                  });
                  apiConnectorInstance.placeOrder(userId, orderItems)
                  .then((response) => {
                    toast({
                      title: "Success",
                      description: response.message,
                      variant: ToastType.DEFAULT,
                    })
                
                    // After placing the order, redirect the user to the order page.
                    // Here we are using replace to prevent the user from going back to the same page
                    // when they click the back button. This is because we don't want the user to place the same order again.
                    router.replace(`/order/confirmation/${response.data.id}`);
                  })
                  .catch((response) => {
                    toast({
                      title: "Error",
                      description: response.message,
                      variant: ToastType.DESTRUCTIVE,
                    })
                  });
                }, 2000);
              }, 2000);
            }, 2000);
          }, 1500);
        }, 2000);
      }, 2000);
    }, 1000);
  }

  /******************** Render Function *****************/
  return (
    <MaxWidthWrapper>
      <LoadingSpinner display={loading} message={message} />
      <div className="grid gap-6 p-6">
        <h1 className="font-semibold text-2xl md:text-3xl">Cart</h1>
        <div className="border shadow-sm rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead className="flex-grow">Product</TableHead>
                <TableHead className="w-20">Price</TableHead>
                <TableHead className="w-36">Quantity</TableHead>
                <TableHead className="w-20">Total</TableHead>
                <TableHead className="w-[40px]"/>
              </TableRow>
            </TableHeader>
            {cartItems?.map((item) => (
                <CartItemComponent
                  key={item.productId}
                  item={item}
                  onClick={() => router.push(`/products/${item.productId}`)}
                  onQuantityChange={(quantity) => {
                    onQuantityChange(quantity, item.productId);
                  }}
                  onRemove={() => {onItemRemove(item.productId)}}
                />
              ))
            }
          </Table>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-2xl font-semibold">Total: £{(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)).toFixed(2)} /-</div>
          <Button className="ml-auto" size="lg" onClick={placeOrder}>
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}