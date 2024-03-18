/**
 * @fileoverview This file contains the user profile page component.
 */

// Directive to use client side rendering.
'use client';

// Imports
import { ApiResponse, User } from "@/shared/interfaces";
import { useEffect, useState } from "react";
import ApiConnector from "@/app/services/ApiConnector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { profilePageTabs } from "@/shared/constants";
import ProfileHeader from "@/components/ProfileHeader";

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

  // This is called when the component is rendered and when the user's id changes.
  useEffect(() => {
    apiConnectorInstance.getUserFromId(params.id)
    .then((response: ApiResponse) => {
      setUser(response.data);
    })
    .catch((response: ApiResponse) => {
      console.error(response);
    });
  }, [params.id]);

  /*************************** Render Function *****************************/
  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <ProfileHeader user={user}/>
      <div className='mt-9'>
        <Tabs defaultValue='Reviews' className='w-full'>
          <TabsList className='flex min-h-[50px] flex-1 items-center gap-3 bg-dark-2 text-light-2 data-[state=active]:bg-[#0e0e12] data-[state=active]:text-light-2'>
            {profilePageTabs.map((tab) => (
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
                    {user.prevOrders.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profilePageTabs.map((tab) => (
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
    </main>
  );
}