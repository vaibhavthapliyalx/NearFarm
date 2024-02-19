'use client';
import * as React from 'react';

import { ToastType, GithubLogoVariant, GoogleLogo, SignupErrorType} from '../../../shared/constants';
import { useState } from 'react';
import { User } from '@/shared/interfaces';
import ApiConnector from '@/app/services/ApiConnector';
// import { Alert, Divider, Icon } from '@mui/material';
import Image from 'next/image';
import VideoProvider from '@/components/VideoProvider/VideoProvider';
import { set } from 'mongoose';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/ui/loadingSpinner';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

const apiConnectorInstance = ApiConnector.getInstance();


export default function Login() {

  const [error, setError] = useState<SignupErrorType>({});

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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

    apiConnectorInstance.login(userData, "credentials")
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      if (error) {
        if(typeof error === 'string'){
          toast(
            {
              description: error,
              variant: ToastType.DESTRUCTIVE,
              title: "Something went wrong!",
              action: <ToastAction altText='Try again'> Try Again </ToastAction>
              
            }
          );
        } else {
        const errorMessages = error.reduce((acc: { [x: string]: any; }, curr: { field: string | number; message: any; }) => {
          acc[curr.field] = curr.message;
          return acc;
        }, {});
        console.log(error);
        error.map((error: any) => {
          toast(
            {
              description: error.message,
              variant: ToastType.DESTRUCTIVE,
              title: "Something went wrong!",
              action: <ToastAction altText='Try again'> Try Again </ToastAction>
                
            }
          );
        })
        
        console.log(errorMessages);
        setError(errorMessages);
      }
      }
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  

  return (
    <>
    <LoadingSpinner display={isLoading} message='Please be patient ! We are working on it!'/>
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
                      type="email"
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
              onClick={apiConnectorInstance.loginWithGithub}
             >
              <Image
                src={GithubLogoVariant.BLACK}
                alt="Github Logo"
                width={20}
                height={20}
                className="mr-2"
              />
              GitHub
            </Button>
            <Button 
              variant="outline" 
              type="button" 
              disabled={isLoading}
              onClick={apiConnectorInstance.loginWithGoogle}
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
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
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