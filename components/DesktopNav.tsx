'use client'

import { NAVBAR_LINKS, NAV_ITEM_TYPE } from '@/shared/constants'
import NavItem from './navItem'
import { usePathname } from 'next/navigation'
import { User } from '@/shared/interfaces'
import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { Icons } from './Icons'
import UserAccountNav from './UserAccountNav'

interface IProps {
  user: User
}
export default function DesktopNav ({user}: IProps) {
  const pathname = usePathname();

  return (
    <MaxWidthWrapper>
      <div className='border-b border-gray-200'>
        <div className='flex h-16 items-center'>
          <div className='ml-4 flex lg:ml-0'>
            <Link href='/'>
              <Icons.logo className='h-10 w-10' />
            </Link>
          </div>

          <div className='hidden z-50 lg:ml-8 lg:block lg:self-stretch'>
          <div className='flex gap-4 h-full'>
            {NAVBAR_LINKS.map((item) => {
              const isActive =
              (pathname.includes(item.route) && item.route.length > 1) ||
              pathname === item.route;
            
            if (item.label !== "Profile")
              
              return (
                <NavItem
                  item={item}
                  type={NAV_ITEM_TYPE.DESKTOP}
                  isActive={isActive}
                  key={item.label}
                />
                
              )
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
              <UserAccountNav user={user} />

              {user ? (
                <span
                  className='h-6 w-px bg-gray-200'
                  aria-hidden='true'
                />
              ) : null}

              {user ? null : (
                <div className='flex lg:ml-6'>
                  <span
                    className='h-6 w-px bg-gray-200'
                    aria-hidden='true'
                  />
                </div>
              )}

              <div className='ml-4 flow-root lg:ml-6'>
                {/* <Cart /> */}
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
   
  )
}
