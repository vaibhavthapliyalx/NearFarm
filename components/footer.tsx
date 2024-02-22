'use client';
import { useEffect, useState } from 'react';
import MaxWidthWrapper from './MaxWidthWrapper';
import { DatabaseIcon, ServerIcon, MoonIcon, SunIcon, HeartIcon, InstagramIcon, FacebookIcon, GithubIcon, LinkedinIcon, ChevronDownIcon, ChevronUpIcon, Facebook, Instagram, Github, Moon, Sun, Dot } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';
import ApiConnector from '@/app/services/ApiConnector';
import { ApiResponse } from '@/shared/interfaces';

const apiConnectorInstance = ApiConnector.getInstance();

export default function Footer() {
  const [isDatabaseConnected, setIsDatabaseConnected] = useState(false);
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [appVersion, setAppVersion] = useState('');
  const [isDropdownIconUp, setIsDropdownIconUp] = useState(false);
  const [isConnectionDropdownOpen, setIsConnectionDropdownOpen] = useState(false);


  const { setTheme } = useTheme();

  useEffect(() => {
    // Get the database connection status
    apiConnectorInstance.getDatabaseConnectionStatus()
    .then((response: ApiResponse) => {
      setIsDatabaseConnected(response.success);
    })
    .catch((response: ApiResponse) => {
      setIsDatabaseConnected(response.success);
    });

    // Get the server connection status 
    apiConnectorInstance.getServerConnectionStatus()
    .then((response: ApiResponse) => {
      setIsServerConnected(response.success);
    })
    .catch((response: ApiResponse) => {
      setIsServerConnected(response.success);
    });

    apiConnectorInstance.getAppVersion()
    .then((response: ApiResponse) => {
      setAppVersion(response.data.version);
    })
    .catch((response: ApiResponse) => {
      setAppVersion("N/A");
    });
  }, []);

  const toggleConnectionDropdown = () => {
    setIsConnectionDropdownOpen(!isConnectionDropdownOpen);
    setIsDropdownIconUp(!isDropdownIconUp);
  };


  return (
    <footer className="bg-white rounded-lg shadow dark:bg-gray-900 m-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
        {/* Brand logo */}
        <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">NearFarm</span>
        </a>
        
        {/* Connection status dropdown */}
        <div className="relative inline-block text-left">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size="default"
                onClick={toggleConnectionDropdown}
                className={`${(isServerConnected && isDatabaseConnected) ? 'text-orange-500 dark:text-orange-400' : 'text-red-500 dark:text-red-400'}`}
              >
                <span className="sr-only">Toggle connection status</span>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-semibold flex flex-row items-center"><Dot color={isServerConnected && isDatabaseConnected ? 'orange' : 'red'} size={40}/> All sytems operational </span>
                  <ChevronDownIcon color={`${(isServerConnected && isDatabaseConnected) ? "orange": "red"}`} className={`h-5 w-5 ${isDropdownIconUp ? 'rotate-180' : ''} transition-transform dark:text-white`} />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className='min-w-full bg-white rounded-lg shadow dark:bg-gray-900 flex flex-col'>
              <DropdownMenuItem className='block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white' role="button">
                <div className="flex items-center space-x-2">
                  <DatabaseIcon className={`${isDatabaseConnected ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'} h-5 w-5`} />
                  <span>Database healthy</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className='block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white' role="button">
                <div className="flex items-center space-x-2">
                  <ServerIcon className={`${isServerConnected ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'} h-5 w-5`} />
                  <span>Server healthy</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

        {/* Divider */}
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />

      {/* Made with heart */}
      <div className="mt-4 flex items-center space-x-2">
        <span className="text-gray-500">Made with</span>
        <HeartIcon className="text-red-500" />
        <span className="text-gray-500">by Vaibhav Thapliyal</span>
      </div>

      {/* Footer text */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Thank you for visiting NearFarm! We are committed to providing you with the best experience.</p>
        <p>If you have any questions or feedback, feel free to reach out to our support team at support@nearfarm.com.</p>
        <p>Stay updated with the latest news and updates by following us on social media:</p>
      </div>

      {/* Copyright */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>© 2024 NearFarm. All rights reserved.</p>
        <p>Version: {appVersion}</p>
      </div>
      {/* Divider */}
      <hr className="mt-1 mb-0 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div className='sm:flex sm:items-center sm:justify-between'>
        <ul className="flex  items-center justify-start text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">About</a>
          </li>
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
          </li>
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
          </li>
          <li>
            <a href="#" className="hover:underline">Contact</a>
          </li>
        </ul>

          {/* Social media links */}
          <div className="flex justify-end items-center space-x-4 mt-0">
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <LinkedinIcon />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <Facebook />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram />
          </a>
          <a href="https://www.github.com" target="_blank" rel="noopener noreferrer">
            <Github />
          </a>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side='top' className='bg-white  rounded-lg shadow dark:bg-gray-900'>
          <DropdownMenuItem onClick={() => setTheme("light")} className='block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white' role="button">
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className='block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white' role="button">
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className='block px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white' role="button">
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      </div>
    </div>
    </footer>
  );
}