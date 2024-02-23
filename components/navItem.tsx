'use client'

import { NAVBAR_LINKS, NAV_ITEM_TYPE } from '@/shared/constants'
import Image from 'next/image'
import { classMerge } from '@/lib/utilityfunctions'
import Link from 'next/link'

type NavBarLinks = (typeof NAVBAR_LINKS)[number]

interface NavItemProps {
  item: NavBarLinks,
  isActive: boolean,
  type: NAV_ITEM_TYPE,
  className?: string
}

const NavItem = ({
  item,
  isActive,
  type,
  className
}: NavItemProps) => {
 



  function renderNavItem(): React.ReactNode {
    let navItem: React.ReactNode = <></>;
    if (type === NAV_ITEM_TYPE.MOBILE) {
      navItem = 
        <Link
          href={item.route}
          key={item.label}
          className={`${isActive ? "bg-primary text-white" : ""} relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5`}
        >
          <Image 
            src={item.imgURL} 
            alt={item.label}
            width={20}
            height={20}
            className='object-contain'
          />
          <p className='text-subtle-medium text-light-1 max-sm:hidden'>
                {item.label.split(/\s+/)[0]}
              </p>
        </Link>;

    } else if (type === NAV_ITEM_TYPE.DESKTOP) {
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
  return (
    <div className={classMerge(["flex", className])}>
      <div className='relative flex items-center'>
        {renderNavItem()}
      </div>
    </div>
)
}

export default NavItem