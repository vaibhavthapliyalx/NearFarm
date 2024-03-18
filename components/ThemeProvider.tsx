/**
 * @fileoverview ThemeProvider component to provide theme context to the application.
 * This code has been copied from the next-themes documentation.
 * Please refer to the next-themes documentation for more information.
 */

// Directive to use client side rendering.
"use client"

// Importing necessary libraries and components.
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

// The ThemeProvider component.
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
