/**
 * @fileoverview This component is used to display the user's profile header.
 * It displays the user's profile picture, name, username, bio, and other details.
 */

// Directive to use client side rendering.
'use client';

// Importing necessary libraries and components.
import { User } from "@/shared/interfaces";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";
import { CalendarIcon, ChevronDownCircle, Mail, MapPin, PhoneIcon } from "lucide-react";
import { getYearFromDate } from "@/lib/utilityfunctions";
import { ChangePasswordDrawer } from "./ChangePassword";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingAnimations/loadingSpinner";
import { AuthenticationStatus, ToastType } from "@/shared/constants";
import Link from "next/link";
import ApiConnector from "@/app/services/ApiConnector";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { ToastAction } from "./ui/toast";
import { useToast } from "./ui/use-toast";

// Interface for the props that the ProfileHeader component accepts.
interface IProps {
  user: User;
}

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * Renders the user's profile header.
 * 
 * @param user The user's data.
 * @returns The rendered user's profile header.
 */
export default function ProfileHeader({user}: IProps) {
  // State variables.
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  // Grabs the user's session status.
  const {status} = useSession();
  // Grabs the toast function from the useToast hook.
  const { toast } = useToast();
  // Grabs the router object.
  const router = useRouter();

  // Gets the user's initials from their name by splitting the name and getting the first letter of each word.
  // This is used as a fallback for the user's profile picture.
  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('');
 

  /**
   * This function is called when the user clicks on the delete account button.
   * This permanently deletes the user's account and all their data from the server.
   * 
   * @returns void 
   */
  function onDeleteAccountClick() {
    // Display the loading spinner and a message.
    setIsLoading(true);
    setLoadingMessage("Deleting all your data from our servers. Please wait...");

    // Check if the user is authenticated, if not, they are not authorized to perform this action.
    if (user.id && status === AuthenticationStatus.AUTHENTICATED) {
      apiConnectorInstance.deleteUserAccount(user.id)
      .then((response) => {
        console.log(response);
        router.push('/login');
      })
      .catch((error) => {
        setIsLoading(false);
        setLoadingMessage('');
        console.log(error);
        toast({
          description: error.message,
          variant: ToastType.DESTRUCTIVE,
          title: "Something went wrong!",
          action: <ToastAction altText='Try again'> Try Again </ToastAction>   
        });
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingMessage('');
      });
    } else {
      setIsLoading(false);
      setLoadingMessage('');
      toast({
        description: "You are not authorized to perform this action",
        variant: ToastType.DESTRUCTIVE,
        title: "Unauthorized Access",
        action: <ToastAction altText='Try again'> Try Again </ToastAction>   
      });
    }
  }

  /*************************** Render Function *******************/
  return (
    <>
      <LoadingSpinner display={isLoading} message={loadingMessage}/>
      <MaxWidthWrapper>
        <div className='flex w-full flex-col justify-start'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='relative h-20 w-20 object-cover'>
                <Avatar className="h-28 w-28 bg-dark-4 rounded-full flex">
                  <AvatarImage src={user.image } alt={user.name} />
                  <AvatarFallback> {initials ?? user.name}</AvatarFallback>
                </Avatar>
              </div>

              <div className='flex-1 ml-16'>
                <h2 className='text-4xl  font-bold tracking-tight text-gray-900 dark:text-gray-100'>
                  {user.name}
                </h2>
                <p className='text-xl tracking-tight text-gray-700 dark:text-gray-400'>@{user.username}</p>
                <div className='flex items-center mt-2'>
              <Mail className='w-5 h-5 mr-2' />
              <p className='text-base text-gray-700 dark:text-gray-400'>{user.email}</p>
            </div>

            <div className='flex items-center mt-2'>
              <MapPin className='w-5 h-5 mr-2' />
              <p className='text-base text-gray-700 dark:text-gray-400'>{user.contactDetails?.address}</p>
            </div>

            <div className='flex items-center mt-2'>
              <PhoneIcon className='w-5 h-5 mr-2' />
              <p className='text-base text-gray-700 dark:text-gray-400'>{user.contactDetails?.phone ? user.contactDetails.phone : "N/A"}</p>
            </div>

            <div className='flex items-center mt-2'>
              <CalendarIcon className='w-5 h-5 mr-2' />
              <p className='text-base text-gray-700 dark:text-gray-400'>Member since: {getYearFromDate(user.joinDate)}</p>
            </div>
              </div>
            </div>
            {status === AuthenticationStatus.AUTHENTICATED && (
              <div className='flex cursor-pointer gap-3 rounded-lg bg-dark-3 px-4 py-2'>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    className='overflow-hidden'
                    >
                      <ChevronDownCircle className='w-8 h-8 text-gray-700 dark:text-gray-400' />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className='bg-white rounded-lg shadow dark:bg-gray-900'
                    align='end'>

                      <DropdownMenuItem role="button"
                        className='cursor-pointer block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white'
                      >
                        <Link href={`/profile/${user.id}/edit`}>
                          Edit Profile
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem role="button"
                        className='cursor-pointer block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white'
                        >
                          <div onClick={(e)=>{e.stopPropagation()}}>
                            <ChangePasswordDrawer 
                              user={user} 
                              displaySpinner={setIsLoading} 
                              setLoadingMessage={setLoadingMessage}
                            />
                          </div>

                      </DropdownMenuItem>

                      <DropdownMenuItem role="button"
                        className='cursor-pointer block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white'
                      >
                        <div onClick={(e)=>{e.stopPropagation()}}> 
                          <AlertDialog>
                            <AlertDialogTrigger
                              className={"text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"}
                            >
                              Delete Account
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your account
                                  and remove your data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={onDeleteAccountClick}>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            )}
          </div>
          <p className='mt-9 max-w-lg ml-5 text-base-regular text-light-2'>{user.bio}</p>
        </div>
      </MaxWidthWrapper>
    </>
    
  );
}
