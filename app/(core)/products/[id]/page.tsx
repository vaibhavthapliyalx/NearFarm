/**
 * @fileoverview This file contains the products page.
 */

// Directive to use the client side rendering.
'use client';

// Imports.
import ApiConnector from "@/app/services/ApiConnector";
import AddReviewDrawer from "@/components/AddReviewDrawer";
import CarouselRenderer from "@/components/CarouselRenderer";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductDetailsDialog from "@/components/ProductDetailsDialog";
import ReviewCard from "@/components/ReviewCard";
import SellerProfileCard from "@/components/SellerProfileCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { reviewValidation } from "@/lib/validations/review.validation";
import { ProductDetailsPageTabType, ProfilePageTabType, ToastType, productPageTabs } from "@/shared/constants";
import { CartItem, Product, Review } from "@/shared/interfaces";
import { ShoppingCart, Star, StarHalf } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as z from "zod";

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
  const [reviews, setReviews] = useState<Review[]>([] as Review[]);
  // Grab the id from the route url.
  const id = params.id;
  // Grabs the toast function from the useToast hook.
  const {toast} = useToast();
  const router = useRouter();

  // Grabs the user session.
  const {data: session} = useSession();

   /**
   * This function fetches the reviews for the product.
   * 
   * @param productId The id of the product for which the reviews are to be fetched.
   */
   function fetchReviews(productId: string) {
    apiConnectorInstance.getReviews({productId: productId})
    .then((response) => {
      setReviews(response.data);
    })
    .catch((error) => {
      console.log(error);
      setReviews([] as Review[]);
    });
  }

  // This is called when the component is rendered and when the product id changes.
  useEffect(() => {
    apiConnectorInstance.getProducts({id: id})
    .then((response) => {
      if (response.success) {
        setProduct(response.data[0]);
        // After the product is fetched, fetch the reviews for the product.
        fetchReviews(id);
      }
    })
    .catch((error) => {
      console.log(error);
      setProduct({} as Product);
    });

    return function cleanup() {
      setProduct({} as Product);
      setReviews([] as Review[]);
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
    if (!user) {
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
      userId: user.id,
      sellerId: product.sellerId,
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

  /**
   * This function is called when the user deletes a review.
   * 
   * @param reviewId The id of the review.
   */
  async function onReviewSubmit(input: z.infer<typeof reviewValidation>) {
    const reviewer = await apiConnectorInstance.getCurrentUserFromSession();

    // Package the review object.
    const review: Review = {
      productId: product.id as string,
      rating: input.rating,
      review: input.review as string,
      productName: product.name,
      userId: reviewer.id,
      userName: reviewer.name,
    }
    // After review object is created, submit the review.
    const res = await apiConnectorInstance.addReview(review);
    if (res.success) {
      toast({
        title: "Success",
        description: res.message,
        variant: ToastType.DEFAULT,
      });
      fetchReviews(product.id as string);
    } else {
      toast({
        title: "Error",
        description: res.message,
        variant: ToastType.DESTRUCTIVE,
        action: <ToastAction altText='Try again'> Try Again </ToastAction> 
      });
    }
  }

  /**
   * This function is called when the user deletes a review.
   * 
   * @param reviewId The id of the review.
   */
  async function onReviewDelete(reviewId: string) {
    const res = await apiConnectorInstance.deleteReview(reviewId);
    if (res.success) {
      toast({
        title: "Success",
        description: res.message,
        variant: ToastType.DEFAULT,
      });
      fetchReviews(product.id as string);
    } else {
      toast({
        title: "Error",
        description: res.message,
        variant: ToastType.DESTRUCTIVE,
        action: <ToastAction altText='Try again'> Try Again </ToastAction> 
      });
    }
  }

  async function onReviewEdit(newInput: z.infer<typeof reviewValidation>) {
    const reviewer = await apiConnectorInstance.getCurrentUserFromSession();
    // Package the review object.
    const review: Review = {
      id: newInput.id,
      productId: product.id as string,
      rating: newInput.rating,
      review: newInput.review as string,
      productName: product.name,
      userId: reviewer.id,
      userName: reviewer.name,
    }
    // After review object is created, submit the review.
    const res = await apiConnectorInstance.updateReview(review);

    if (res.success) {
      toast({
        title: "Success",
        description: res.message,
        variant: ToastType.DEFAULT,
      });
      fetchReviews(product.id as string);
    } else {
      toast({
        title: "Error",
        description: res.message,
        variant: ToastType.DESTRUCTIVE,
        action: <ToastAction altText='Try again'> Try Again </ToastAction> 
      });
    }
  }

  /************ Render Function ***********/
  return (
    <MaxWidthWrapper>
      <div className="grid gap-6 items-start max-w-6xl px-4 mx-auto py-6">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start">
          <CarouselRenderer
            images={product.catalogue && product.catalogue.length > 0 ? product.catalogue : [product?.image]}
            imageHeight={900}
            imageWidth={900}
            className="w-full rounded-lg dark:border-gray-800"           
          />
          <div className="grid gap-4 md:gap-10 items-start lg:mt-3">
            <div className="grid gap-4">
              <h1 className="font-bold text-3xl lg:text-4xl">{product?.name}</h1>
              <div className='flex items-center'>
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
                <span className="text-sm text-black-200 ml-2">{reviews.length} reviews</span>
                <AddReviewDrawer onReviewSubmit={onReviewSubmit} disabled={session?.user.id === product.sellerId }/>
              </div>
              <div className="text-sm text-black-200">
                {product.quantity >= 1 ? (
                  <Badge variant="default">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
              <section className="flex flex-row items-center mt-1">
                <div className="text-primary mr-2 text-clamp text-5xl font-bold">
                £{product.salePrice}
                </div>
                <div className="text-black-200 line-through text-clamp text-md">
                £{product.marketPrice}
                </div>
              </section>
              <div className="text-sm leading-loose flex flex-wrap items-end">
                {product.description}
                <ProductDetailsDialog
                  product={product}
                />
              </div>
            </div>
            <Button size="lg" onClick={onAddToCartClick} disabled={product.quantity < 1 || session?.user.id === product.sellerId}>
            <ShoppingCart size={20} className="mr-1"/>
              Add to Cart
            </Button>
          </div>
          <div className="grid gap-4"/>
        </div>
        <Tabs defaultValue={ProfilePageTabType.REVIEWS} className='w-full'>
        <TabsList className='flex min-h-[48px] flex-1 items-center gap-3  text-light-2 data-[state=active]:bg-primary data-[state=active]:text-white'>
          {productPageTabs.map((tab) => (
            <TabsTrigger key={tab.label} value={tab.value} className='flex min-h-[38px] flex-1 items-center gap-3  text-light-2 data-[state=active]:bg-primary data-[state=active]:text-white '>
              <p>{tab.label}</p>
            </TabsTrigger>
          ))}
        </TabsList>
          {productPageTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className='w-full text-light-1'
            >
              {tab.value === ProductDetailsPageTabType.REVIEWS && (
                <div className="mt-14 flex flex-wrap justify-start">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="flex-none relative w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-3">
                        <ReviewCard 
                          review={review}
                          onDelete={() => onReviewDelete(review.id as string)}
                          onModify={onReviewEdit}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-black-200 mt-10">
                      No reviews found for this product.
                    </div>
                  )} 
                </div>
              )}
              {tab.value === ProductDetailsPageTabType.SELLER_INFO && (
                <SellerProfileCard sellerId={product.sellerId}/>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MaxWidthWrapper>
  );
}