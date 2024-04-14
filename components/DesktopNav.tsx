/**
 * @fileoverview This file contains the desktop navigation component.
 * This nav bar is used to display the navigation links for the desktop view.
 */

// Directive to use client side rendering.
'use client'

// Imports
import { NavbarLinks, NavItemType } from '@/shared/constants'
import NavItem from './NavItem'
import { usePathname } from 'next/navigation'
import { User } from '@/shared/interfaces'
import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import UserAccountNav from './UserAccountNav'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { isObjectEmpty } from '@/lib/utilityfunctions'
import { useTheme } from 'next-themes'

// Interface for the DesktopNav component props.
interface IProps {
  user: User
}

/**
 * This function renders the DesktopNav component.
 * 
 * @param user The user object.
 * @returns The rendered DesktopNav component.
 */
export default function DesktopNav ({user}: IProps) {
  // Grabs the current pathname from the router.
  const pathname = usePathname();
  // Grabs the resolved theme from the useTheme hook.
  const {resolvedTheme} = useTheme();

  /********************** Render Function******************/
  return (
    <MaxWidthWrapper>
      <div className='border-b border-gray-200'>
        <div className='flex h-16 items-center'>
          <div className='ml-4 flex lg:ml-0'>
            <Link href='/'>
              <Image
                src='/assets/logos/app/logo.png'
                alt='Logo'
                width={75}
                height={75}
              />
            </Link>
          </div>
          <div className='hidden z-50 lg:ml-8 lg:block lg:self-stretch'>
            <div className='flex gap-4 h-full'>
              {NavbarLinks.map((item) => {
                const isActive =
                (pathname.includes(item.route) && item.route.length > 1) ||
                pathname === item.route;
                if (item.label !== "Profile" && item.label !== "Cart") {
                  return (
                    <NavItem
                      item={item}
                      type={NavItemType.DESKTOP}
                      isActive={isActive}
                      key={item.label}
                    />
                      
                  )
                }
                })}
            </div>
          </div>
          <div className='ml-auto flex items-center'>
            <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6'>
              {user ? null : (
                <span
                  className='h-6 w-px bg-gray-200'
                  aria-hidden='true'
                />
              )}
              <Link
                href={!isObjectEmpty(user) ? `/cart/${user.id}` : "/cart"}
                key={user.id}
                className={`${pathname === `/cart/${user.id}` ? "bg-primary text-white" : ""} relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5`}
              >
                <ShoppingCart size={28}
                  stroke='white'
                  style={{filter: resolvedTheme === 'light' && pathname !== `/cart/${user.id}` ? 'invert(1)' : 'invert(0)'}}
                />
              </Link>    
              <UserAccountNav user={user} />
              {!isObjectEmpty(user) ? (
                <span
                  className='h-6 w-px bg-gray-200'
                  aria-hidden='true'
                />
              ) : null}
              <div className='ml-4 flow-root lg:ml-6'>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}
