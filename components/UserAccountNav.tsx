/**
 * @fileoverview This file contains the user account navigation component.
 * This allows the user to navigate to their profile and log out of the application
 * in both mobile and desktop views.
 */

// Importing necessary libraries and components.
import ApiConnector from '@/app/services/ApiConnector';
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { User } from '@/shared/interfaces';

// Interface for the props that the UserAccountNav component accepts.
interface IProps {
  user: User;
}

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * Renders the user account navigation component.
 * 
 * @param user The user object.
 * @returns The rendered user account navigation component.
 */
export default function UserAccountNav({ user }: IProps) {
  // Grabs the user's session object.
  const { data: session } = useSession();
  // Grabs the user's initials from their name by splitting the name and getting the first letter of each word.
  const initials = session?.user.name.split(' ').map((n: string) => n[0]).join('');
  // Grabs the router object.
  const router = useRouter();
  // Grabs the current path of the page.
  const pathName = usePathname();

  /********************** Render Function ***********************/
  return (
    <>
      { session && user  ?  (
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className='overflow-hidden'
            >
              <Avatar className='cursor-pointer'>
                <AvatarImage src={user.image } alt={user.name} />
                <AvatarFallback> {initials ?? user.name}</AvatarFallback>
              </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='bg-white rounded-lg shadow dark:bg-gray-900'
            align='end'>
            <div className='flex items-center justify-start gap-2 p-2'>
              <div className='flex flex-col space-y-0.5 leading-none'>
                <p className='block px-2 py-2 text-sm text-gray-900  dark:text-white '>
                  {user.name}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild
              className='cursor-pointer block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white'
            >
              <Link href={`/profile/${user.id}`}>My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={apiConnectorInstance.logout}
              className='cursor-pointer block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white'
              >
                Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        (pathName !== '/login' && pathName !== '/signup') && (
          <Button
            onClick={() => router.push('/login')}
            className='text-sm'
            variant='outline'>
            Log in
          </Button>
        )
      )}
    </>
  )
}