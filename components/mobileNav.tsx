import { NAVBAR_LINKS, NAV_ITEM_TYPE } from '@/shared/constants'
import { usePathname } from 'next/navigation'
import NavItem from './navItem'


const MobileNav = () => {

  const pathname = usePathname();

  // Keeps tracks of current page being active.
  let isActive = false;

  // /**
  //  * This useEffect hook is used to add the overflow-hidden class to the body when the mobile nav is open.
  //  * This is to prevent the body from scrolling when the mobile nav is open.
  //  */
  // useEffect(() => {
  //   if (isOpen)
  //     document.body.classList.add('overflow-hidden')
  //   else document.body.classList.remove('overflow-hidden')
  // }, [isOpen])

  return (
    <section className='fixed bottom-0 z-10 w-full rounded-t-3xl bg-glassmorphism p-4 backdrop-blur-lg xs:px-7 lg:hidden'>
      <div className='flex items-center justify-between gap-3 xs:gap-5'>
        {NAVBAR_LINKS.map((item) => {
          isActive =
          (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;
          return (
          <NavItem
            type={NAV_ITEM_TYPE.MOBILE}
            key={item.label}
            item={item}
            isActive={isActive}
            className={`relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5`}
          />
        )})}
      </div>
      {/* <div className='pt-4 pb-3 border-t border-gray-200'>
        <div className='flex items-center px-5'>
          <div className='flex-shrink-0'>
            <img className='h-10 w-10 rounded-full' src='/images/user.jpg' alt='' />
          </div>
          <div className='ml-3'>
            <div className='text-base font-medium leading-none text-gray-800'>Your Name</div>
            <div className='text-sm font-medium leading-none text-gray-400'>you@example.com</div>
          </div>
          <button className='ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'>
            <span className='sr-only'>View notifications</span>
            <BellIcon className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>
        <div className='mt-3 px-2 space-y-1'>
          <Link
            onClick={() => closeOnCurrent('/sign-in')}
            href='/sign-in'
            className='block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50'>
            Sign in
          </Link>
          <Link
            onClick={() => closeOnCurrent('/sign-up')}
            href='/sign-up'
            className='block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50'>
            Sign up
          </Link>
        </div> */}
      {/* </div> */}
    </section>
  )
}

export default MobileNav
