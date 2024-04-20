/**
 * @fileoverview This file contains the login page of the application.
 */

// Directive to use client side rendering.
'use client';

// Imports
import * as React from 'react';
import { ToastType, GoogleLogo, SignupErrorType, ProviderType } from '../../../shared/constants';
import { FormEvent, useEffect, useState } from 'react';
import { ApiResponse, User } from '@/shared/interfaces';
import ApiConnector from '@/app/services/ApiConnector';
import Image from 'next/image';
import VideoProvider from '@/components/VideoProvider/VideoProvider';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/LoadingAnimations/LoadingSpinner';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * This function renders the login page component.
 * 
 * @returns The rendered login page component.
 */
export default function Login() {
  // State variables.
  const [error, setError] = useState<SignupErrorType>({});
  const [isLoading, setIsLoading] = useState(false);

  // Grabs the toast function from the useToast hook.
  const { toast } = useToast();

  // This hook is used to display the error message when the user is not authorized.
  // This logic is handled in the middleware.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    console.log(params.get('error'));
    const message = params.get('error');
    if (message) {
      // Display toast after 500ms to avoid SSR issues.
      // This fixes the bug where the toast is not displayed on the client side.
      setTimeout(() => {
        toast({
          description: message,
          variant: ToastType.DESTRUCTIVE,
          title: "Error 401 - Unauthorized",
        });
      }, 500);
    }
  }, []);

  /**
   *  This function logs the user in when the form is submitted.
   * 
   * @param event The form event object that contains the form data.
   */
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });

    const userData = {} as User;
    userData.email = data.get('email') as string;
    userData.password = data.get('password') as string;

    apiConnectorInstance.login(ProviderType.CREDENTIALS, userData)
    .then((response: ApiResponse) => {
      // Callback redirects the user automatically to the home page.
      // We don't need to handle that here.
    })
    .catch((error: ApiResponse) => {
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
          error.message.map((error: ApiResponse) => {
            toast({
                description: error.message,
                variant: ToastType.DESTRUCTIVE,
                title: "Something went wrong!",
                action: <ToastAction altText='Try again'> Try Again </ToastAction>   
              });
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
      <LoadingSpinner display={isLoading} message='Logging you in...' />
      <div className="container mt-10 lg:mt-0 relative  h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r border-r-2 border-gray-200">
          <div className="absolute inset-0 bg-auto" />
          <VideoProvider className={"w-full h-full "}/>
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
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Login to your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email or username and password below to login to your account
              </p>
            </div>
            <div className={"grid gap-6"}>
              <form onSubmit={onSubmit} className="space-y-8">
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label htmlFor="email">
                      Email or Username
                    </Label>
                    <Input
                      id="email"
                      name='email'
                      placeholder="name@example.com"
                      onClick={() => setError({
                        ...error,
                        email: ""
                      })}
                      type="text"
                      autoCapitalize="none"
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
                      onClick={() => setError({
                        ...error,
                        password: ""
                      })}
                      name='password'
                      placeholder="enter your password"
                      type="password"
                      autoCapitalize="none"
                      autoCorrect="off"
                      disabled={isLoading}
                    />
                    {error.password && <p className="text-red-500">{error.password}</p>} {/* Display password error */}
                  </div>
                  <Button disabled={isLoading}>
                    Sign in
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
            <Button variant="outline"
              type="button" 
              disabled={isLoading}
              onClick={() => apiConnectorInstance.login(ProviderType.GITHUB)}
             >
              <GitHubLogoIcon className="w-5 h-5 mr-2" />
              GitHub
            </Button>
            <Button 
              variant="outline" 
              type="button" 
              disabled={isLoading}
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
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign up here
            </Link>
          </p>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Forgot your password?{" "}
            <Link
              href="/forgot-password"
              className="underline underline-offset-4 hover:text-primary"
            >
              Reset it here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}