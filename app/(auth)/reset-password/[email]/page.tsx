'use client';
import React, { useEffect, useState } from 'react';
import {useRouter, useSearchParams} from "next/navigation" 
import LoadingSpinner from '@/components/ui/loadingSpinner';
import ApiConnector from '@/app/services/ApiConnector';
import { BannerProps, ResetPasswordPayload } from '@/shared/interfaces';
import { ToastType } from '@/shared/constants';

import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface IProps {
  params: {
    email: string;
  }
}

const apiConnectorInstance = ApiConnector.getInstance();

export default function ResetPassword({params}: IProps) {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();
  const [banner, setBanner] = useState<BannerProps>({} as BannerProps);

  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    // package the data to send to the server.
    const payload: ResetPasswordPayload = {
      email: params.email,
      password: password,
      confirmPassword: confirmPassword,
      signature: searchParams.get('signature') || '',
    }
       
    // Send the request to the server.
    apiConnectorInstance.resetPassword(payload)
      .then((response) => {
      
        console.log(response);
        toast({
          description: response?.body?.message,
          variant: ToastType.DEFAULT,
          title: "Success!",
        })

        // Redirect to the login page after 2 seconds.
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        
      })
      .catch((error) => {
    

        toast({
            description: error?.body?.message,
            variant: ToastType.DESTRUCTIVE,
            title: "Something went wrong!",
          }
        );
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
                Yay! Your password reset link is valid.
                <br/>
                Now we are just a few steps away from resetting your password.
                <br/>
                Please enter your new passoword below. And don&apos;t forget to confirm it.
              </p>
            </div>
            <div className="grid gap-6 ">
              <form onSubmit={onSubmit} className="space-y-8">
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label htmlFor="password">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name='password'
                      placeholder="name@example.com"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="password"
                      autoCorrect="off"
                      disabled={isLoading}
                      className="p-4"
                    />

                    <Label htmlFor="confirmPassword">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name='confirmPassword'
                      placeholder="please confirm your password"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="password"
                      autoCorrect="off"
                      disabled={isLoading}
                      className="p-4"
                    />
                  </div>
                  <Button disabled={isLoading} className="p-4"> {/* Increase padding to make the button bigger */}
                    Reset Password 
                  </Button> 
                </div>
              </form>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6 dark:text-gray-400">
              No longer want to reset your password?{" "}
              <Link
                href="/login"
                className="underline underline-offset-4 hover:text-primary dark:text-gray-400"
              >
                Login instead
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </>  );
};
