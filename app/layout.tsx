// Importing global styles
import './globals.css';
import AuthProvider from './provider/AuthProvider';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster"

// React imports
import { Suspense } from 'react';
import Footer from '../components/footer';
import NavigationBar from '@/components/navbar';
import { classMerge } from '@/lib/utilityfunctions';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter  = Inter({subsets: ['latin']});
// Metadata for the layout
export const metadata = {
  title: 'NearFarm',
  description:
    `Final Year Project`
};

// Root layout component
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Rendering the layout
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
              <main className="relative flex flex-col min-h-screen">
                <div className="flex-grow flex-1">
                {children}
                 </div>
                 <Toaster/>
                 
              </main>
              <Footer/>

              {/** This div adds space to the bottom in smaller screens */}
              <div className="h-16 sm:h-28 lg:hidden" /> 

          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
