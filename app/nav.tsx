// This file wraps up the navbar component and handles the logic for the navbar.

// Directive to use client side rendering.
'use client';

// Imports
import { useEffect, useState } from 'react';
import Navbar from './components/navbar';
import ApiConnector from './ApiConnector/ApiConnector';
import { Admin } from './Shared/Interfaces';
import { useRouter } from 'next/navigation';

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * Renders the navigation component.
 * The navbar is only rendered if the user is logged in.
 * If the user is not logged in, they are redirected to the login page.
 * 
 * @returns The rendered navigation component.
 */
export default function Nav() {
  // State variables.
  const[loggedin, setLoggedin] = useState<boolean>(true);
  const[isLoggedIn, setIsLoggedIn] = useState(false);

  // Uses the useRouter hook to get the router object.
  // This is helpful for redirecting the user to a different page by its path.
  const router = useRouter();


  /********************** Render Function **********************/
  return (
    <>
      <Navbar
      
      /> 

    </>
  );
}