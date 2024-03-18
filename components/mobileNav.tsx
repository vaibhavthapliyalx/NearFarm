/**
 * @fileoverview This file contains the mobile navigation component.
 * It is used to render the mobile navigation bar.
 */

// Directive to use client side rendering.
"use client";

// Imports.
import { NavbarLinks, NavItemType } from '@/shared/constants'
import { usePathname } from 'next/navigation'
import NavItem from './NavItem'
import { User } from '@/shared/interfaces';
import UserAccountNav from './UserAccountNav';
import { isObjectEmpty } from '@/lib/utilityfunctions';

// Interface for the props of the MobileNav component.
interface IProps {
  user: User
}

/**
 * This function renders the mobile navigation component.
 * 
 * @param user - The user object.
 * @returns The rendered mobile navigation component.
 */
export default function MobileNav({ user }: IProps) {
  // Grabs the current path of the page.
  const pathname = usePathname();

  // Keeps tracks of current page being active.
  let isActive = false;

  /************************* Render Function **********************/
  return (
    <section className='fixed bottom-0 z-10 w-full rounded-t-3xl bg-glassmorphism p-4 backdrop-blur-lg xs:px-7 lg:hidden'>
      <div className='flex items-center justify-between gap-3 xs:gap-5'>
        {NavbarLinks.map((item) => {
          isActive =
          (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;
          let children = null;
          if(!isObjectEmpty(user) && item.label === "Profile") {
            console.log("User is as below");
            console.log(user);
            // item.route = `/profile/${user.id}`;
            children = <UserAccountNav user={user}/>;
          }
          return (
            <NavItem
              type={NavItemType.MOBILE}
              key={item.label}
              item={item}
              isActive={isActive}
              children={children}
              className={`relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5`}
            />
        )})}
      </div>
    </section>
  )
}
