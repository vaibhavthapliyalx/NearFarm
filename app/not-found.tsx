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
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)] text-center">
      <Image
        src="/assets/logos/app/full-logo.png"
        alt="404"
        width={400}
        height={400}
      />
      <h1 className="text-xl">Oops! The page you're looking for doesn't exist.</h1>
      <p>It seems you've hit a roadblock. Don't worry, we'll help you get back on track.</p>
      <p> If you think this is in error, please report it to us via the report issue link in the footer.</p>
      <Link href="/" passHref>
        <Button variant="link">Return to Homepage?</Button>
      </Link>
    </div>
  )
}