/**
 * fileoverview This file contains the 404 page.
 */

// Imports.
import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

// Metadata for the 404 page.
export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

/**
 * This function renders the NotFound component.
 * 
 * @returns The rendered NotFound component.
 */
export default function NotFound() {
  /**************** Render Function *****************/
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <Image
        src="/assets/logos/app/full-logo.png"
        alt="404"
        width={300}
        height={300}
      />
      404 Hello there! It seems you are lost. <br />
      
      <Link href="/" passHref>
        <Button variant="link">Go back to homepage?</Button>
      </Link>
    </div>
  )
}