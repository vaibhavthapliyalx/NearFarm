/**
 * @fileoverview This file contains the products page.
 */

// Directive to use the client side rendering.
'use client';

// Imports.
import ApiConnector from "@/app/services/ApiConnector";
import CarouselRenderer from "@/components/CarouselRenderer";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { ToastType, productPageTabs } from "@/shared/constants";
import { CartItem, Product } from "@/shared/interfaces";
import { ShoppingCart, Star, StarHalf } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

// Interface for the props of the ProductDetailsPage component.
interface IProps {
  params: any;
}
// Grab the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * This function renders the ProductDetailsPage component.
 * 
 * @param {any} params The id param object passed to the component.
 * @returns The rendered ProductDetailsPage component.
 */
export default function ProductDetailsPage({params}: IProps) {
  // State variables.
  const [product, setProduct] = useState<Product>({} as Product);
  // Grab the id from the route url.
  const id = params.id;
  // Grabs the toast function from the useToast hook.
  const {toast} = useToast();

  // This is called when the component is rendered and when the product id changes.
  useEffect(() => {
    apiConnectorInstance.getProducts({id: id})
    .then((response) => {
      if (response.success) {
        setProduct(response.data[0]);
      }
    })
    .catch((error) => {
      console.log(error);
      setProduct({} as Product);
    });

    return function cleanup() {
      setProduct({} as Product);
    }
  }, [id]);

  /**
   * This function is called when the user clicks on the add to cart button.
   * This adds the product to the user's cart.
   * 
   * @param e The click event object.
   */
  async function onAddToCartClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    const user = await apiConnectorInstance.getCurrentUserFromSession();
    console.log("User")
    console.log(user);
    const cartItem: CartItem = {
      userId: user.id,
      productId: product.id as string,
      quantity: 1,
      name: product.name,
      price: product.salePrice,
      image: product.image,
    }
    apiConnectorInstance.addItemToCart(cartItem)
    .then((response) => {
      toast({
        title: "Success",
        description: response.message,
        variant: ToastType.DEFAULT,
      })
    })
    .catch((error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: ToastType.DESTRUCTIVE,
        action: <ToastAction altText='Try again'> Try Again </ToastAction> 
      })
    });
  }

  /************ Render Function ***********/
  return (
    <MaxWidthWrapper>
      <div className="grid gap-6 items-start max-w-6xl px-4 mx-auto py-6">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start">
          <CarouselRenderer
            images={product?.catalogue ? product.catalogue : [product.image]}
            imageHeight={900}
            imageWidth={900}
            className="w-full rounded-lg dark:border-gray-800"           
          />
          <div className="grid gap-4 md:gap-10 items-start lg:mt-3">
            <div className="grid gap-4">
              <h1 className="font-bold text-3xl lg:text-4xl">{product?.name}</h1>
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
                {product.rating}
              </div>
              <section className="flex flex-row items-center mt-1">
                <div className="text-primary mr-2 text-clamp text-5xl font-bold">
                ₹{product.salePrice}
                </div>
                <div className="text-black-200 line-through text-clamp text-md">
                ₹{product.marketPrice}
                </div>
              </section>
              <div className="grid gap-4 text-sm leading-loose whitespace-pre-line">
                {product.description}
              </div>
            </div>
            <Button size="lg" onClick={onAddToCartClick}>
            <ShoppingCart size={20} className="mr-1"/>
              Add to Cart
            </Button>
          </div>
          <div className="grid gap-4">
          </div>
        </div>
        <Tabs defaultValue='Reviews' className='w-full'>
          <TabsList className='flex min-h-[50px] flex-1 items-center gap-3 bg-dark-2 text-light-2 data-[state=active]:bg-[#0e0e12] data-[state=active]:text-light-2'>
            {productPageTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='flex min-h-[50px] flex-1 items-center gap-3 bg-dark-2 text-light-2 data-[state=active]:bg-[#0e0e12] data-[state=active]:text-light-2 '>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>

                {tab.label === "Orders" && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {'sample'}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {productPageTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className='w-full text-light-1'
            >
              {/* @ts-ignore */}
              {/* ToDo: Add tabs here */}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MaxWidthWrapper>
  );
}