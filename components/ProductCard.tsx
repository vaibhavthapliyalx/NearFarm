/**
 * @fileoverview This file contains the ProductCard component.
 */

// Imports.
import { CartItem, Product } from '@/shared/interfaces';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useRouter } from 'next/navigation';
import { MapPin, ShoppingCart, Star, StarHalf } from 'lucide-react';
import CarouselRenderer from './CarouselRenderer';
import { Button } from './ui/button';
import ApiConnector from '@/app/services/ApiConnector';
import { useToast } from './ui/use-toast';
import { ToastType } from '@/shared/constants';
import { ToastAction } from './ui/toast';
import { isObjectEmpty } from '@/lib/utilityfunctions';
import { useSession } from 'next-auth/react';

// Interface for the props of the ProductCard component.
interface IProps {
  product: Product;
}
// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * This function renders the product card.
 * 
 * @param product - The product object.
 * @returns The rendered product card.
 */
export default function ProductCard({ product }: IProps) {
  // Grabs the toast function from the useToast hook.
  const {toast} = useToast();
  // Get the router instance.
  const router = useRouter();

  // Grabs the user session.
  const {data: session} = useSession();

  /**
   * This function is called when the user clicks on the add to cart button.
   * This adds the product to the user's cart.
   * 
   * @param e The click event object.
   */
  function onAddToCartClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (!session || isObjectEmpty(session)) {
      toast({
        title: "Error",
        description: "You must be logged in to add items to cart.",
        variant: ToastType.DESTRUCTIVE,
        action: <ToastAction 
          altText='Login' 
          onClick={() =>router.push("/login")}
        > 
          Login 
        </ToastAction>
      });
      return;
    }
    const cartItem: CartItem = {
      userId: session?.user?.id as string,
      sellerId: product.sellerId,
      productId: product.id as string,
      quantity: 1,
      name: product.name,
      price: product.salePrice,
      image: product.image,
    }
    apiConnectorInstance.addItemToCart(cartItem)
    .then((response) => {
      console.log(response);
      toast({
        title: "Success",
        description: response.message,
        variant: ToastType.DEFAULT,
      })
    })
    .catch((error) => {
      console.error(error);
      toast({
        title: "Error",
        description: error.message,
        variant: ToastType.DESTRUCTIVE,
        action: <ToastAction altText='Try again'> Try Again </ToastAction> 
      })
    });
  }

  /************** Render Function *************/
  return(
    <Card className='bg-inherit border dark:border-gray-700 hover:shadow-primary  grid grid-cols-1 gap-2 mb-3  mx-auto rounded-md relative cursor-pointer'
      onClick={() => router.push(`/products/${product.id}`)}
    >
      <CardHeader className="mx-auto flex relative w-full border-b">
        <CarouselRenderer
          key={product.id}
          images={product.catalogue && product.catalogue.length > 0 ? product.catalogue : [product?.image]}
          imageHeight={350}
          imageWidth={350}
          className="lg:hover:scale-110 transform transition duration-500 ml-[3px]"           
          />
        <div className='flex relative'>
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} fill="#f0be8f" strokeWidth={0} className='h-5 w-5' />
            ))}
          </div>
          <div className="flex gap-1 absolute">
            {Array.from({ length: Math.floor(product.rating) }, (_, i) => (
              <Star key={i} fill="#ea580b" strokeWidth={0} className='h-5 w-5' />
            ))}
            {product.rating % 1 !== 0 && <StarHalf fill="#ea580b" strokeWidth={0} className='h-5 w-5' />}
          </div>
          {product.rating?.toFixed(1)}
        </div>
      </CardHeader>
      <CardContent className="p-2 w-full">
        <CardTitle className="flex flex-row items-start">
          <span
            className="font-semibold text-black-900 truncate w-full text-clamp"
          >
            {product.name}
          </span>
        </CardTitle>
        <section className="flex flex-row items-center mt-1">
          <div className="text-primary mr-2 text-clamp text-2xl font-bold">
          £{product.salePrice}
          </div>
          <div className="text-black-200 line-through text-clamp">
          £{product.marketPrice}
          </div>
        </section>
        <section className="flex flex-row items-center mb-1">
          <span className="text-xs text-gray-600 font-medium">
            You Save £{(product.marketPrice - product.salePrice).toFixed(2)}
          </span>
          <span className="text-xs text-green-900 ml-1 font-medium">
            {(((product.marketPrice - product.salePrice) / product.marketPrice) * 100).toFixed(0)}% off
          </span>
        </section>
        <Button 
          onClick={onAddToCartClick}
          disabled={product.quantity < 1 || product.sellerId === session?.user?.id}
          className="bg-primary text-white text-sm font-semibold rounded-md w-full py-1 mt-2 border border-transparent transition-all duration-200 hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-orange-500 dark:hover:ring-gray-500"
        >
          <ShoppingCart size={20} className="mr-1"/>
          Add to Cart
        </Button>
      </CardContent>
      <CardFooter className="flex flex-row items-center justify-between p-2  border-t border-gray-200">
        <div className="flex items-center space-x-1 text-sm text-gray-400">
          <MapPin className="text-gray-400 w-5 h-5" />
          <span>{product.collectionAddress || "Whiteabbey, Jordanstown Rd, Belfast, BT37 0ST"}</span>
        </div>
      </CardFooter>
    </Card>
  );
}