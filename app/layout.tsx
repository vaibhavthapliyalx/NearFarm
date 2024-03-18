/**
 * @fileoverview This file contains the root layout component.
 */

// Importing global styles
import './globals.css';

// Imports.
import AuthProvider from './provider/AuthProvider';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import NavigationBar from '@/components/NavBar';
import { classMerge } from '@/lib/utilityfunctions';
import { ThemeProvider } from '@/components/ThemeProvider';
import ProgressBar from '@/components/LoadingAnimations/ProgressBar';
import Footer from '@/components/Footer';

// Gets the instance of the Inter font.
const inter  = Inter({subsets: ['latin']});
// Metadata for the layout
export const metadata = {
  title: 'NearFarm',
  description:
    `Final Year Project`
};

interface IProps {
  children: React.ReactNode;
}

/**
 * This function renders the root layout component.
 * 
 * @param children The children to render inside the layout.
 * @returns The rendered root layout component.
 */
export default function RootLayout({ children }: IProps){

  /***************************************** Render Function **********************************/
  return (
    <html lang="en" className="h-full bg-inherit">
      <body className={classMerge("relative h-full font-sans antialiased", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <NavigationBar/>
            <ProgressBar/>
              <main className="relative flex flex-col min-h-screen">
                <div className="flex-grow flex-1">
                {children}
                 </div>
                 <Toaster/>
              </main>
              <Footer/>
              {/** This div adds space to the bottom in smaller screens and fixes the issue of controls being hidden by mobile navbar*/}
              <div className="h-16 sm:h-28 lg:hidden" /> 
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
