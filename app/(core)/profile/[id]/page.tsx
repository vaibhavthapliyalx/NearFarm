/**
 * @fileoverview This file contains the user profile page component.
 */

// Directive to use client side rendering.
'use client';

// Imports
import { ApiResponse, Review, User } from "@/shared/interfaces";
import { Suspense, useEffect, useState } from "react";
import ApiConnector from "@/app/services/ApiConnector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfilePageTabType, profilePageTabs } from "@/shared/constants";
import ProfileHeader from "@/components/ProfileHeader";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import OrderTable from "@/components/OrderTable";
import ReviewCard from "@/components/ReviewCard";
import { useRouter } from "next/navigation";
import { Edit, Frown } from "lucide-react";

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * This function renders the user profile page component.
 * 
 * @param {any} params The id param object passed to the component.
 * @returns The rendered user profile page component.
 */
export default function UserProfile({params}: any) {
  // State variables.
  const [user, setUser] = useState<User>({} as User);
  const [reviews, setReviews] = useState<Review[]>([]);

  const router = useRouter();

  // This is called when the component is rendered and when the user's id changes.
  useEffect(() => {
    async function fetchUser() {
      // Fetch the user.
      const response = await apiConnectorInstance.getUserFromId(params.id);
      if (response.success) {
        setUser(response.data);
      }
    }

    async function fetchReviews() {
      // Fetch the reviews.
      const response = await apiConnectorInstance.getReviews({userId: params.id});
      if (response.success) {
        setReviews(response.data);
      }
    }

    // Call the functions.
    fetchUser();
    fetchReviews();

    // When component is unmounted, cleanup the states.
    return function cleanup() {
      setUser({} as User);
      setReviews([]);
    }
  }, [params.id]);

  /*************************** Render Function *****************************/
  return (
    <MaxWidthWrapper>
    <div className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-10'>
      <ProfileHeader user={user}/>
      <div className='mt-9'>
      <Tabs defaultValue={ProfilePageTabType.ORDERS} className='w-full'>
        <TabsList className='flex min-h-[48px] flex-1 items-center gap-3  text-light-2 data-[state=active]:bg-primary data-[state=active]:text-white'>
          {profilePageTabs.map((tab) => (
            <TabsTrigger key={tab.label} value={tab.value} className='flex min-h-[38px] flex-1 items-center gap-3  text-light-2 data-[state=active]:bg-primary data-[state=active]:text-white '>
              <p>{tab.label}</p>
            </TabsTrigger>
          ))}
        </TabsList>
          {profilePageTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className='w-full text-light-1'
            >
              {tab.value === ProfilePageTabType.ORDERS && (
                <Suspense fallback={<div>Loading...</div>}>
                 <OrderTable userId={user.id || ""}/>
                </Suspense>
              )}
              {tab.value === ProfilePageTabType.REVIEWS && (
                <div className='flex flex-col w-full p-8 gap-6 justify-center items-center'>
                  {reviews.length === 0 ? (
                      // If the cart is empty, render the empty cart component.
                      <div className=" mt-10">
                        <div className=" items-center gap-4">
                        <Frown 
                          size={50} 
                        />
                          <h1 className="font-semibold text-2xl md:text-3xl">
                            You haven't written any reviews yet.
                          </h1>
                        </div>
                      </div>
                  ) : (
                    // If the cart is not empty, render the cart items.
                    reviews.map((review) => (
                        <div 
                        onClick={() => router.push(`/products/${review.productId}`)}
                        className="cursor-pointer inline-block border rounded hover:border-gray-200"
                        >
                        <ReviewCard key={review.id} review={review} onDelete={()=>{}} onModify={()=>{}} />
                      </div>
                    ))
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
    </MaxWidthWrapper>
  );
}