/**
 * @fileoverview This file contains the AccountProfile component which enables users to edit their profile.
 * This component is also used to complete the onboarding process for new users.
 */

// Directive to use client side rendering.
"use client";

// Imports.
import { useForm } from "react-hook-form";
import { ChangeEvent, useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUploadThing } from "@/lib/uploadthing";
import { calculateAge, classMerge, isBase64Image } from "@/lib/utilityfunctions";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ToastType, UserRole } from "@/shared/constants";
import { ApiResponse, User } from "@/shared/interfaces";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { onBoardingValidation } from "@/lib/validations/onboarding.validation";
import ApiConnector from "@/app/services/ApiConnector";
import { useToast } from "./ui/use-toast";
import LoadingSpinner from "./LoadingAnimations/loadingSpinner";
import { ToastAction } from "./ui/toast";

// Interface for the props of the AccountProfile component.
interface IProps {
  user: User;
  onOnboardingComplete: (response: ApiResponse) => void;
}

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * This function renders the AccountProfile component.
 * 
 * @param {Props} props The props of the AccountProfile component.
 * @returns The rendered AccountProfile component.
 */
export default function AccountProfile({ user, onOnboardingComplete }: IProps) {
  // Starts the upload process for the user's profile photo.
  // This is done using the useUploadThing hook in the uploadthing module.
  // The userPhotoUploader is the name of the module defined in /api/uploadthing/core.ts
  const { startUpload } = useUploadThing("userPhotoUploader");

  // State variables.
  const [usernameValidation, setUsernameValidation] = useState({isValid: false, message: ""});
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  // Grabs the toast function from the useToast hook.
  const {toast} = useToast();

  // Creates a form using the useForm hook from react-hook-form.
  const form = useForm<z.infer<typeof onBoardingValidation>>({
    resolver: zodResolver(onBoardingValidation),
    defaultValues: {
      image: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
      dob: new Date(),
      phone: user?.contactDetails?.phone || "",
      address: user?.contactDetails?.address || "",
      role: user?.role as UserRole || UserRole.CONSUMER,
    },
  });

  /**
   * This function is called when the user submits the form.
   * It updates the user's profile on the server.
   * 
   * @param {any} values The form values.
   * 
   * @returns void
   */
  async function onSubmit(values: any) {
    setIsLoading(true);
    const blob = values.image;
    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].url) {
        values.image = imgRes[0].url;
      }
    }
    const userObject: User = {
      id: user.id,
      name: values.name,
      username: values.username,
      bio: values.bio,
      image: values.image,
      role: values.role,
      contactDetails: {
        phone: values.phone,
        email: user.email,
        address: values.address,
      },
      age: calculateAge(values.dob),
      isOnBoarded: true,
      email: user.email,
      prevOrders: user.prevOrders,
      cart: user.cart,
      joinDate: user.joinDate,
      resetPasswordToken: user.resetPasswordToken,
      documents: user.documents,
      isVerified: user.isVerified,
    };
    apiConnectorInstance.updateUser(userObject)
    .then((response: ApiResponse) => {
      console.log(response);
      onOnboardingComplete(response);
    })
    .catch((error: ApiResponse) => {
      console.log(error);
      if (error.message === "Username already taken") {
        setUsernameValidation({
          isValid: false,
          message: error.message
        });
      }
      toast({
        description: error.message,
        variant: ToastType.DESTRUCTIVE,
        title: "Something went wrong!",
        action: <ToastAction altText='Try again'> Try Again </ToastAction>   
      });
    })
    .finally(() => {
      setIsLoading(false);
    });
    }

  /**
   * This function is called when the user selects an image to upload.
   * Implementations include previewing the image and changing the field value.
   * 
   * @param e The change event.
   * @param fieldChange The function to change the field value.
   * @returns void 
   */
  function handleImage(e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      // If the file is not an image, return.
      if (!file.type.includes("image")) return;
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  /***************************** Render Function *****************************/
  return (
    <>
      <LoadingSpinner display={isLoading} message='Finishing your profile setup!'/>
      <Form {...form}>
        <form
          className='flex flex-col justify-start gap-10'
          onSubmit={form.handleSubmit(onSubmit)}
          onError={(errors) => console.log(errors)}
        >
          <FormField
            control={form.control}
            name='image'
            render={({ field }) => (
              <FormItem className='flex items-center gap-4'>
                <FormLabel className='flex h-24 w-24 items-center justify-center rounded-full bg-dark-4'>
                  <Avatar
                    className="h-28 w-28 bg-dark-4 rounded-full flex items-center justify-center "
                  >
                  {field.value ? (
                    <AvatarImage src={field.value} alt="image" />
                  ) : (
                    <AvatarFallback>Choose Photo</AvatarFallback>

                  )}
                  </Avatar>
                </FormLabel>
                <FormControl className='flex-1 text-base-semibold text-gray-200'>
                  <Input
                    type='file'
                    accept='image/*'
                    placeholder='Add profile photo'
                    className='cursor-pointer border-none bg-transparent outline-none file:text-blue'
                    onChange={(e) => handleImage(e, field.onChange)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-light-2'>
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    className='border border-dark-4 text-light-1'
                    autoCapitalize="words"
                    autoSave="name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-light-2'>
                  Username
                </FormLabel>
                <FormControl>
                  <div className="flex flex-row gap-1 items-center">
                  <Input
                    type='text'
                    className='border border-dark-4  text-light-1'
                    {...field}
                  />
                  { usernameValidation.message && <XCircle className="h-6 w-6 text-red-500" />}
                  </div>
                </FormControl>
                <FormDescription>
                  Your username is used to identify you on the platform.
                </FormDescription>
                <FormMessage>
                  {usernameValidation.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='bio'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-light-2'>
                  Bio
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={10}
                    className='border border-dark-4 text-light-1 '
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Your bio is used to tell others about yourself.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={classMerge(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1950-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  We use this to generate statistics and to improve your experience on the platform.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Phone number(+44)</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    required={false}
                    className="border border-dark-4 text-light-1"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is optional. It is used for communication across farmers and consumers.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name = "address"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Full Address</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="border border-dark-4 text-light-1"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please enter your full address including your postal code.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Please choose your account type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.CONSUMER}>Consumer</SelectItem>
                    <SelectItem value={UserRole.FARMER}>Farmer</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Your role determines the type of account you will have.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            disabled={true}
            name='docs'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-light-2 opacity-50 pointer-events-none'>
                  Upload documents here for verification
                </FormLabel>

                <FormControl>
                  <Input
                    disabled={true}
                    type='file'
                    accept='image/*'
                    placeholder='Upload here'
                    className='border border-dark-4 bg-dark-3 text-light-1'
                    onChange={(e) => {}}

                  />
                </FormControl>
                <FormDescription> 
                  {`Please upload a valid ID card, passport or driver's license for getting a verified badge on your profile.
                  This feature is only available to farmers and is used to ensure that consumers can trust the farmers they are buying from.`}
                  {<br />}
                  <span style={{ color: 'red' }}>*Please note that this feature is not yet available. We are working hard to make it available soon.</span>
                </FormDescription>

              </FormItem>
            )}
          />
          <Button type='submit' onSubmit={onSubmit}>
            Continue
          </Button>
        </form>
      </Form>
    </>
  );
};
