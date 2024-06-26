/**
 * @fileoverview This file contains the signup page of the application.
 */

// Directive to use client side rendering.
'use client';

// Imports
import * as React from 'react';
import { ToastType, GoogleLogo, SignupErrorType, ProviderType} from '../../../shared/constants';
import { useState } from 'react';
import { ApiResponse, User } from '@/shared/interfaces';
import ApiConnector from '@/app/services/ApiConnector';
import Image from 'next/image';
import VideoProvider from '@/components/VideoProvider/VideoProvider';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/LoadingAnimations/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import { useRouter } from 'next/navigation';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * This function renders the signup page component.
 * 
 * @returns The rendered signup page component.
 */
export default function SignUp() {
  // State variables.
  const [error, setError] = useState<SignupErrorType>({});
  const [isLoading, setIsLoading] = useState(false);

  // Grabs the toast function from the useToast hook.
  const { toast } = useToast();
  // Grabs the router object that allows for navigation between pages.
  const router = useRouter();

  /**
   *  This function signs the user up when the form is submitted.
   * 
   * @param event The form event object that contains the form data.
   */
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const data = new FormData(event.currentTarget);
    const userData = {} as User;
    userData.email = data.get('email') as string;
    userData.password = data.get('password') as string;
    userData.name = data.get('name') as string;
    userData.joinDate = new Date().toISOString();

    // Send the request to the server.
    apiConnectorInstance.signup(userData)
    .then((response) => {
      toast(
        {
          description: response.message,
          variant: ToastType.SUCCESS,
          title: "Account created successfully",
          action: <ToastAction altText='Continue to login' onClick={() => router.push("/login")}> Continue to login </ToastAction>
        }
      );
    })
    .catch((error:ApiResponse) => {  
      if (error) {
        if(typeof error.message === 'string'){
          toast({
              description: error.message,
              variant: ToastType.DESTRUCTIVE,
              title: "Something went wrong!",
              action: <ToastAction altText='Try again'> Try Again </ToastAction> 
            });
        } else {
        const errorMessages = error.message.reduce((acc: { [x: string]: any; }, curr: { field: string | number; message: any; }) => {
          acc[curr.field] = curr.message;
          return acc;
        }, {});
        console.log(error);
        error.message.map((error: any) => {
          toast(
            {
              description: error.message,
              variant: ToastType.DESTRUCTIVE,
              title: "Something went wrong!",
              action: <ToastAction altText='Try again'> Try Again</ToastAction>
            }
          );
        })
        setError(errorMessages);
        }
      }
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  /************************ Render Function ************************/
  return (
    <>
    <LoadingSpinner display={isLoading} message='Creating new entry in our database...' />
    <div className="container mt-10 lg:mt-0 relative h-[800px] max-h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:grid dark:border-r border-r-2 border-gray-200">
        <div className="absolue inset-0 bg-zinc-900" />
        <VideoProvider className={"w-full h-full flex"}/>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Providing you with the freshest produce from our farm to
              your table.&rdquo;
            </p>
          </blockquote> 
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px] lg:w-[600px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password below to create your account
            </p>
          </div>
          <div className={"grid gap-6"}>
            <form onSubmit={onSubmit}>
              <div className="grid gap-2">
                <div className="grid gap-3">
                <Label  htmlFor="name">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Jon Doe"
                    name='name'
                    type="name"
                    autoCapitalize="none"
                    onClick={() => setError({
                      ...error,
                      name: ""
                    })}
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                  {error.name && <p className="text-red-500">{error.name}</p>}
                  <Label  htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name='email'
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    onClick={() => setError({
                      ...error,
                      email: ""
                    })}
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                  {error.email && <p className="text-red-500">{error.email}</p>} {/* Display email error */}
                  <Label  htmlFor="password">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name='password'
                    placeholder="enter your password"
                    type="password"
                    autoCapitalize="none"
                    onClick={() => setError({
                      ...error,
                      password: ""
                    })
                    }
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                  {error.password && <p className="text-red-500">{error.password}</p>} {/* Display password error */}
                  <Label  htmlFor="email">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    name='confirm-password'
                    placeholder="please re-enter your password"
                    type="password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    onClick={() => setError({
                      ...error,
                      password: ""
                    })
                    }
                    disabled={isLoading}
                  />
                  {error.password && <p className="text-red-500">{error.password}</p>} {/* Display password error */}
                </div>
                <Button disabled={isLoading}>
                  Sign up 
                </Button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button variant="outline" type="button" disabled={isLoading}
              onClick={() => apiConnectorInstance.login(ProviderType.GITHUB)}
            >
              <GitHubLogoIcon className="w-5 h-5 mr-2" />
              GitHub
            </Button>
            <Button variant="outline" type="button" disabled={isLoading} 
              onClick={() => apiConnectorInstance.login(ProviderType.GOOGLE)}
            >
              <Image
                src={GoogleLogo.DEFAULT}
                alt="Google Logo"
                width={20}
                height={20}
                className="mr-2"
              />
              Google
            </Button>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="https://utfs.io/f/9020d4d0-5be3-49b0-a630-6c16485b6242-1yb1t7.pdf"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Log in here
          </Link>
        </p>
        </div>
      </div>
    </>
  );
}