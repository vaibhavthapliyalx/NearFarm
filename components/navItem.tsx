/**
 * @fileoverview This file renders the navigation item component.
 */

// Directive to use client side rendering.
'use client'

// Importing necessary libraries and components.
import { NavbarLinks, NavItemType } from '@/shared/constants'
import Image from 'next/image'
import { classMerge } from '@/lib/utilityfunctions'
import Link from 'next/link'

type NavBarLinks = (typeof NavbarLinks)[number]

// Defining the type of the props that the NavItem component accepts.
interface NavItemProps {
  item: NavBarLinks,
  isActive: boolean,
  type: NavItemType,
  className?: string,
  children?: React.ReactNode
}

/**
 * Renders the navigation item component.
 * 
 * @param item The navigation item.
 * @param isActive The state of the navigation item.
 * @param type The type of the navigation item.
 * @param className The class name of the navigation item.
 * @param children The children of the navigation item.
 * @returns The rendered navigation item.
 */
export default function NavItem({ item, isActive, type, className, children }: NavItemProps): React.ReactElement {
  /**
   * Renders the navigation item.
   * If the navigation item type is mobile or desktop, the navigation item is rendered accordingly.
   * 
   * @returns The rendered navigation item.
   */
  function renderNavItem(): React.ReactNode {
    let navItem: React.ReactNode = <></>;
    if (type === NavItemType.MOBILE) {
      navItem = 
        <Link
          href={children ? "" : item.route}
          key={item.label}
          className={`${isActive ? "bg-primary text-white" : ""} relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5`}
        >
          {
            children ? children : (
              <Image 
                src={item.imgURL} 
                alt={item.label}
                width={20}
                height={20}
                className='object-contain'
              />
            )
          }
          <p className='text-subtle-medium text-light-1 max-sm:hidden'>
            {item.label.split(/\s+/)[0]}
          </p>
        </Link>;

    } else if (type === NavItemType.DESKTOP) {
      navItem = 
        <Link
        href={item.route}
        key={item.label}
        className={`${isActive ? "bg-primary text-white" : ""} relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5`}
        >
        <p className='text-subtle-medium text-light-1 max-sm:hidden'>
          {item.label.split(/\s+/)[0]}
        </p>
        </Link>;
          
    } else {
      throw new Error('Invalid type');
    }
    return navItem;
  }
  
  /********************** Render Function ***********************/
  return (
    <div className={classMerge(["flex", className])}>
      <div className='relative flex items-center'>
        {renderNavItem()}
      </div>
    </div>
  );
}