'use client'
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
import { AvatarIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

const apiConnectorInstance = ApiConnector.getInstance();

const UserAccountNav = ({ user }: { user: any }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const pathName = usePathname();


  return (
    <>
      {session ?  (
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className='overflow-hidden'
            >
              <Avatar className='cursor-pointer'>
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback> {user.name[0]}</AvatarFallback>
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
              <Link href='/sell'>My Profile</Link>
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

export default UserAccountNav