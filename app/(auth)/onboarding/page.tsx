/**
 * @fileoverview Onboarding page for new users.
 */

// Directive to use client side rendering.
'use client';

// Imports
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ApiConnector from "@/app/services/ApiConnector";
import AccountProfile from "@/components/AccountProfile";
import { User } from "@/shared/interfaces";
import LoadingSpinner from "@/components/LoadingAnimations/LoadingSpinner";
import { AuthenticationStatus } from "@/shared/constants";

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * This function renders the onboarding page component for new users.
 *
 * @returns The rendered onboarding page component.
 */
export default function Onboarding() {
  // Grabs the user's session.
  const { data: session, status } = useSession();

  // State variables.
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState<boolean>(true);

  // Grabs the router object that allows for navigation between pages.
  const router = useRouter();

  /**
   * This function is called when the component is rendered and when the user's session changes.
   * It fetches the user's data from the server and sets the user state variable.  
   */
  useEffect(() => {
    if (status === AuthenticationStatus.AUTHENTICATED && session) {
      apiConnectorInstance.getUserFromEmail(session.user.email)
        .then((res) => {
          const user = res.data;
          setUser(user);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setUser({} as User);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [status, session]);

  /*************************** Render Function ***************************/
  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <h1 className='head-text'>Thank you for choosing NearFarm</h1>
      <p className='mt-3 text-base-regular text-light-2'>
       Please complete your profile below to get started.
      </p>
      <section className='mt-9  p-10'>
        {loading ? (
          <LoadingSpinner display={loading} message="Fetching your profile" />
          ) : (
          <AccountProfile user={user} onOnboardingComplete={()=>{router.push("/")}}/>
          )
        }
      </section>
    </main>
  );
}
