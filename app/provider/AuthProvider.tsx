/**
 * @fileoverview This file contains the AuthProvider component.
 * This component is used to wrap the entire application to provide the session context.
 * This session context is used to manage the user session and authentication state.
 */

// Directive to use client side rendering.
// Note: Since session is a client side only object, we need to use client side rendering.
'use client'

// Imports
import { SessionProvider } from 'next-auth/react'

// Interface for the AuthProvider component props.
interface IProps {
  children: React.ReactNode
}
export default function AuthProvider({ children }: IProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}