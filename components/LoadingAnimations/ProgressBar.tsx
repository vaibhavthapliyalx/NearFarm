/**
 * @fileoverview This file contains the progress bar component.
 */

// Directive to use client side rendering.
'use client';

// Imports.
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * This function renders the progress bar component.
 * 
 * @returns The rendered progress bar component.
 */
export default function ProgressBar() {
  // State variables.
  const [displayBar, setDisplayBar] = useState(false);
  const pathname = usePathname();

  // UseEffect hook to display the progress bar when the page changes.
  // This is currently a work in progress.
  // ToDo: Modify the implementation and find the way to link all the pages to the progress bar.
  useEffect(()=>{
    setDisplayBar(true);
    setTimeout(() => {
      setDisplayBar(false);
    }, 3000);
  }, [pathname]);

  /************************ Render Function ***************************/
  return (
    <>
      {displayBar && (
        <div className='w-full z-50'>
          <div className='h-1.5 w-full bg-pink-100 overflow-hidden'>
            <div className='animate-progress w-full h-full bg-primary origin-left-right'></div>
          </div>
        </div>
      )}
    </>
  );
}