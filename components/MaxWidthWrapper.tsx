/**
 * @fileoverview This file contains the MaxWidthWrapper component.
 * It is used to wrap the content of the page and set a max width for the content.
 * It acts as a wrapper for the entire page content within the application.
 */

// Imports.
import { classMerge } from "@/lib/utilityfunctions";

// Interface for the props of the MaxWidthWrapper component.
interface IProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * This function renders the MaxWidthWrapper component.
 * 
 * @param className - The class name for the component used for styling.
 * @param children - The children passed to this wrapper component.
 * @returns The rendered MaxWidthWrapper component.
 */
export default function MaxWidthWrapper({ className, children }: IProps) {
  /********************* Render Function *********************/
  return(
    <div className={classMerge("mx-auto w-full max-w-screen-xl px-2.5 md:px20", className)}>
      {children}
    </div>
  )
}