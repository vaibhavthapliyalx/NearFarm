/**
 * @fileoverview This file contains the edit profile page component.
 */

// Directive to use client side rendering.
'use client';

// Imports
import ApiConnector from "@/app/services/ApiConnector";
import AccountProfile from "@/components/AccountProfile";
import LoadingSpinner from "@/components/LoadingAnimations/LoadingSpinner";
import { ApiResponse, User } from "@/shared/interfaces";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/** 
 * @param {any} params The id param object passed to the component.
 * 
 * @returns The rendered edit profile page component.
 */
export default function EditProfile({params}: any) {
  // State variables.
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState<boolean>(true);

  // Grabs the router object that allows for navigation between pages.
  const router = useRouter();

  /**
   * This is called when the component is rendered and when the user's id changes.
   * It fetches the user's data from the server and sets the user state variable.  
   */
  useEffect(() => {
    setLoading(true);
    // Send the request to the server and grab the user with the id from the params.
    apiConnectorInstance.getUserFromId(params.id)
    .then((response: ApiResponse) => {
      setUser(response.data);
    })
    .catch((response: ApiResponse) => {
      console.error(response);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [params.id]);

  /********************************* Render Function ***************************/
  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <p className='mt-3 text-base-regular text-light-2'>
       Edit your profile below.
      </p>
      <section className='mt-9  p-10'>
        {loading ? (
          <LoadingSpinner display={loading} message="Fetching your profile" />
          ) : (
          <AccountProfile user={user} onOnboardingComplete={()=>{router.back()}}/>
          )
        }
      </section>
    </main>
  )
}         