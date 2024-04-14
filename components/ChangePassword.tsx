/**
 * @fileoverview This file contains the ChangePasswordDrawer component.
 */

// Imports.
'use client';

// Imports.
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,    
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Input } from "@/components/ui/input";
import { classMerge } from "@/lib/utilityfunctions";
import { passwordChangeValidation } from "@/lib/validations/onboarding.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { ApiResponse, User } from "@/shared/interfaces";
import { useState } from "react";
import ApiConnector from "@/app/services/ApiConnector";
import { toast } from "./ui/use-toast";
import { AuthenticationStatus, ToastType } from "@/shared/constants";
import { ToastAction } from "./ui/toast";
import { useSession } from "next-auth/react";

// Interface for the props of the component.
interface IProps {
  user: User;
  displaySpinner: (display: boolean) => void;
  setLoadingMessage: (message: string) => void;
}

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * This function renders the ChangePasswordDrawer component.
 * 
 * @param user The user object.
 * @param displaySpinner The function to display the spinner.
 * @param setLoadingMessage The function to set the loading message.
 * @returns The rendered ChangePasswordDrawer component.
 */
export function ChangePasswordDrawer( {user, setLoadingMessage, displaySpinner}: IProps) {
  // State variables.
  const [open, setOpen] = useState(false);
  // Gets the session status.
  const { status } = useSession();

  // Form created using react-hook-form.
  const form = useForm<z.infer<typeof passwordChangeValidation>>({
    resolver: zodResolver(passwordChangeValidation),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  /**
   * This function is called when the user submits the form.
   * It updates the user's password in the backend.
   * 
   * @param formData The form data.
   * @returns void
   */
  async function onSumbit(formData: any) {
    console.log("Form submitted")
    console.log(formData);
    // Close the drawer.
    setOpen(false);
    // Display the loading spinner.
    setLoadingMessage("Updating your password in our systems now !");
    displaySpinner(true);

    // If the user is authenticated, update the password.
    if (user && user.id && status === AuthenticationStatus.AUTHENTICATED) {
      apiConnectorInstance.changePassword({
        id: user.id,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      })
      .then((response: ApiResponse) => {
        toast({
          description: response.message,
          variant: ToastType.DEFAULT,
          title: "Success"   
        });
      })
      .catch((error: ApiResponse) => {
        console.log(error);
        toast({
          description: error.message,
          variant: ToastType.DESTRUCTIVE,
          title: "Something went wrong!",
          action: <ToastAction altText='Try again'> Try Again </ToastAction>   
        });
      })
      .finally(() => {
        // Close the spinner.
        displaySpinner(false);
      });
    }
  }

  /**
   * This function renders the password change form.
   * 
   * @param className The class name.
   * @returns The rendered password change form.
   */
  function renderPasswordChangeForm({ className }: React.ComponentProps<"form">): React.ReactNode {
    return (
      <form className={classMerge("grid items-start gap-4", className)} onSubmit={form.handleSubmit(onSumbit)}>
        <div className="grid gap-2">
        <FormField
            control={form.control}
            name='oldPassword'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-light-2'>
                  Old Password
                </FormLabel>
                <FormControl>
                  <div className="flex flex-row gap-1 items-center">
                  <Input
                    type='password'
                    className='border border-dark-4  text-light-1'
                    {...field}
                    // This fixes the Bug where the drawer closes when user presses spacebar.
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  </div>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2">
        <FormField
            control={form.control}
            name='newPassword'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-light-2'>
                  Password
                </FormLabel>
                <FormControl>
                  <div className="flex flex-row gap-1 items-center">
                  <Input
                    type='password'
                    className='border border-dark-4  text-light-1'
                    {...field}
                    // This fixes the Bug where the drawer closes when user presses spacebar.
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  </div>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Save changes</Button>
      </form>
    )
  }

  /******************** Render Function ************************/
  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <div
            className="w-18" 
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            Change Password
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Change Password</DrawerTitle>
            <DrawerDescription>
              {`Update your password to keep your account secure. Click save when you're done.`}
            </DrawerDescription>
          </DrawerHeader>
          <FormProvider {...form}>
            {renderPasswordChangeForm({ className: "p-4" })}
          </FormProvider>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            <span className="text-sm text-yellow-500">{`*Please note that if you have signed up using third-party, you can't change your password here.`}
            Please refer to the third-party service for password changes.</span>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

