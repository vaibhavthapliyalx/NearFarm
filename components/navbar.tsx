/**
 * @fileoverview This file renders the navigation bar component.
 * This is the main navigation component that manages to render the navbar
 * based on device size. It also checks if the user is logged in and redirects
 * them to the login page if they are not logged in.
 */

// Directive to use client side rendering.
'use client';
// Importing necessary libraries and components
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ApiConnector from '@/app/services/ApiConnector';
import MobileNav from './MobileNav';
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
  const pathname = usePathname();

  // When the navbar is rendered, check if the user is logged in.
  // If the user is not logged in, redirect them to the login page.
  // Here, we listen to updates to the url path which in turn is helpful in updating the navbar in real time.
  // ToDo: Check if this approach makes the app slow and if it does, find a better approach.
  useEffect(() => {
    function fetchData() {
      apiConnectorInstance.getCurrentUserFromSession()
      .then((user) => {
        // Currently, the user is not redirected to the login page if they are not logged in.
        // This is disabled for now because it is causing a bug in the app.
        // ToDo: Fix the bug and find a way to redirect the user to the login page if they are not logged in.

        // If the user is not logged in, redirect them to the login page.
        if (!user) {
          setUser({} as User)
          // router.push('/login');
          return;
        } else {
          // Making request to server to get the user's data
          apiConnectorInstance.getUserFromEmail(user.email)
          .then((response) => {
            const userData: User = response.data;
            setUser(userData);
            // If the user is not onboarded, redirect them to the onboarding page
            if (!userData.isOnBoarded) {
              router.push('/onboarding');
            } else {
              // Do nothing
            }
          })
        }
      })
      .catch((error) => {
        console.log(error);
        setUser({} as User);
        router.push('/login');
      })
    }
    fetchData();
    
    // Cleanup function to run when the component is unmounted.
    return function cleanup() {
      console.log('Navbar Unmounted');
    }
    }, [pathname]);

  return (
    <>
    <div className='hidden lg:block bg-inherit sticky z-50 top-0 inset-x-0 h-16'>
      <header className='relative bg-inherit '>
      <DesktopNav user={user} />    
      </header>
    </div>
    <MobileNav user={user} />
    </>
  );
};
