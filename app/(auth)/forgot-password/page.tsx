'use client';
import React, { useState } from 'react';
import { SignupErrorType, ToastType } from '@/shared/constants';
import { BannerProps } from '@/shared/interfaces';
import LoadingSpinner from '@/components/ui/loadingSpinner';
import ApiConnector from '@/app/services/ApiConnector';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

export default function ForgotPassword() {
  const [error, setError] = useState<SignupErrorType>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast }  = useToast();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
    });

    const email = data.get('email') as string;

    // Send the request to the server.
    apiConnectorInstance.forgotPassword(email)
      .then((response) => {
        toast({
          description: response?.body?.message,
          variant: ToastType.DEFAULT,
          title: "Success!",
        })
      })
      .catch((error) => {
      
        console.log("Below is the error")
        console.log(error);
        if (error) {
          if(typeof error === 'string'){
            toast(
              {
                description: error,
                variant: ToastType.DESTRUCTIVE,
                title: "Something went wrong!",
              }
            );
          } else {
            const errorMessages = error.reduce((acc: { [x: string]: any; }, curr: { field: string | number; message: any; }) => {
              acc[curr.field] = curr.message;
              return acc;
            }, {});
            console.log(error);
            error.map((error: any) => {
              toast({
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
      <div className="container relative h-screen w-screen overflow-hidden flex flex-col items-center justify-center md:flex md:items-center md:justify-center lg:max-w-none lg:grid-cols-2 lg:items-center lg:justify-center ">
      <Card className="lg:p-8 p-4 rounded-lg sm:w-[450px] sm:h-[450px] lg:w-[500px] lg:h-[500px]  bg-inherit border-2 w-full h-auto">
        <Image 
          src="/assets/logos/app/logo.png"
          alt="Logo"
          layout="responsive"
          width={500}
          height={500}
          className='mx-auto'
        />
          <div className="mx-auto flex flex-col justify-center space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Reset your password
              </h1>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                It is common to forget your password. We've all been there, so we'll make this quick.
                <br/>
                Just enter your email below and passoword reset link should be on your way.
              </p>
            </div>
            <div className="grid gap-6 ">
              <form onSubmit={onSubmit} className="space-y-8">
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label htmlFor="email">
                      Email
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
                      className="p-4" // Increase padding to make the input field bigger
                    />
                    {error.email && <p className="text-red-500">{error.email}</p>} {/* Display email error */}
                  </div>
                  <Button disabled={isLoading} className="p-4"> {/* Increase padding to make the button bigger */}
                    Send Reset Link
                  </Button> 
                </div>
              </form>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6 dark:text-gray-400">
              Remembered your password?{" "}
              <Link
                href="/login"
                className="underline underline-offset-4 hover:text-primary dark:text-gray-400"
              >
                Login here
              </Link>
            </p>
            <p className="text-center text-sm text-muted-foreground mt-6 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="underline underline-offset-4 hover:text-primary dark:text-gray-400"
              >
                Signup here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </>
  );
 }