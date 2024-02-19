'use client';
// Importing necessary libraries and components
import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import ApiConnector from '@/app/services/ApiConnector';
import Image from 'next/image';
import { buttonVariants } from './ui/button';
import MaxWidthWrapper from './MaxWidthWrapper';
import { Icons } from './Icons';
import NavItems from './DesktopNav';
import Link from 'next/link';
import MobileNav from './mobileNav';
import UserAccountNav from './UserAccountNav';
import DesktopNav from './DesktopNav';
import { User } from '@/shared/interfaces';


// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * Renders the navigation component.
 * The navbar is only rendered if the user is logged in.
 * If the user is not logged in, they are redirected to the login page.
 * 
 * @returns The rendered navigation component.
 */
export default function NavigationBar() {
  const [user, setUser] = useState<User>({} as User);

  const router = useRouter();

  // When the navbar is rendered, check if the user is logged in.
  // If the user is not logged in, redirect them to the login page.
  useEffect(() => {
    apiConnectorInstance.getCurrentUserFromSession()
    .then((user) => {
      setUser(user);
      // Making request to server to get the user's data
      apiConnectorInstance.getUserFromEmail(user.email)
      .then((userData) => {
        console.log("Check this");
        console.log(userData);
        // If the user is not onboarded, redirect them to the onboarding page
        if (!userData.isOnBoarded) {
          router.push('/onboarding');
        } else {
          // Do nothing
        }
      })
    })
    .catch((error) => {
      console.log(error);
      setUser({} as User);
      // router.push('/login');
    })
    }, []);






  return (
    <>
    <div className='hidden lg:block bg-inherit sticky z-50 top-0 inset-x-0 h-16'>
      <header className='relative bg-inherit '>
      <DesktopNav user={user} />    
      </header>
    </div>
    <MobileNav />
    </>
    
  );
};
