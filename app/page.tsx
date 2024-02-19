// This file is the entry point for the application.
// This file contains the dashboard page component.

// Directive to use client side rendering.
"use client";

// Imports

import ApiConnector from './services/ApiConnector';
import { useEffect, useState } from 'react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import {CheckCircle, Leaf, MapPinnedIcon} from 'lucide-react'

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

const features = [
  {
    name: 'Guaranteed Quality',
    Icon: CheckCircle,
    description:
      'We ensure that the produce you receive is of the highest quality, every time.',
  },
  {
    name: 'Local Produce',
    Icon: MapPinnedIcon,
    description:
      'We connect you with local farmers to bring you the freshest produce.',
  },
  {
    name: 'Sustainable',
    Icon: Leaf,
    description:
      'We are committed to sustainable farming practices.',
  },
];

/**
 * This function renders the dashboard page component.
 * 
 * @param searchParams  The search query.
 * @returns The rendered dashboard page component.
 */
export default function Home({ searchParams } : { searchParams: {q?: string} }) {
  // State variables.
  const [currentUser, setCurrentUser] = useState<any>();
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  
  useEffect(() => {
    apiConnectorInstance.getCurrentUserFromSession()
    .then((user) => {
      console.log(user);
      setCurrentUser(user);
      setTimeout(() => {
        setIsPageLoading(false);
      }, 5000);
    })
    .catch((error) => {
      console.log(error);
      setCurrentUser("");
    })
  },[]);
 

  /********************** Render Function **********************/
  return (
    <>
    <MaxWidthWrapper>
      {/* {isPageLoading ? (
      <>
        {Will display skeleton of full page here}
      </>
    ) : ( */}
      <div className='p-y20 mx-auto text-center flex flex-col items-center max-w-3xl mt-8 mb-8'>
        <h1 className='text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl'>
          Harvesting local {' '} <span className='text-orange-600'> Goodness</span>{' '} for you.
        </h1>
        <p className='mt-6 text-large max-q-prose text-muted-foreground'>
          Hello {currentUser ? currentUser.name.split(" ")[0] : "Guest"} 👋 
          <br/>
          Welcome to NearFarm,
          <br />
          Every day, we connect local farmers with local consumers to bring you the freshest produce.
        </p>
        <div className='flex flex-col  sm:flex-row gap-4 mt-6'>
          <Link href={"/products"} passHref
            className={buttonVariants()}
          >
            Browse Trending
          </Link>
          <Button variant={'ghost'}> Our quality promise &rarr;</Button>
        </div>

      </div>
      {/* ToDO: Insert the products available */}
    </MaxWidthWrapper>
    <section className='border-t border-gray-200 bg-gray-50'>
      <MaxWidthWrapper className='py-20'> 
        <div className='grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0'>
          {features.map((feature) => (
            <div key={feature.name} className='text-center md:items-start md:text-left lg:block lg:text-center'>
              <div className='md:flex-shrink-0 flex justify-center'>
                <div className='h-16 w-16 flex items-center justify-center rounded-full bg-orange-100 text-orange-800'>
                  {<feature.Icon className='w-1/3 h-1/3'/>}
                </div>
                </div>
                <div className='mt-6 md: ml-4 md:mt-0 lg:ml-0 lg:mt-6'>
                  <h3 className='text-base font-medium text-gray-900'>
                    {feature.name}
                  </h3>
                  <p className='mt-3 text-sm text-muted-foreground'>
                    {feature.description}
                  </p>
                </div>
            </div>
          ))}
        </div>

      </MaxWidthWrapper>
    </section>
    </>
  );
}



