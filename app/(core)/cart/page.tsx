/**
 * @fileoverview This file contains the cart page that is rendered when user is not logged in.
 */

// Imports.
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

/**
 * This function renders the UnauthorizedCart component.
 * 
 * @returns The rendered UnauthorizedCart component.
 */
export default function UnauthorizedCart() {

  /**************** Render Function *************/
  return (
   <MaxWidthWrapper>  
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-20">
        Oops! Nothing to see here
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-400">
        Please <a href="/login" className="text-primary">Login</a> to continue
      </p>
    </div>
   </MaxWidthWrapper>
  )
}