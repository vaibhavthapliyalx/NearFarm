// This file is the entry point for the application.
// This file contains the dashboard page component.
// All other components e.g. Tables, Navbar are rendered from this component.

// Directive to use client side rendering.
"use client";

// Imports

import Slider from '@mui/material/Slider';
import ApiConnector from './ApiConnector/ApiConnector';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Nav from './nav';

import { TableType, SortOrder, MembershipStatus } from './Shared/Enums';
import { Admin } from './Shared/Interfaces';

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * This function renders the dashboard page component.
 * 
 * @param searchParams  The search query.
 * @returns The rendered dashboard page component.
 */
export default function Dashboard({ searchParams } : { searchParams: {q?: string} }) {
  // State variables.
  const [admin, setAdmin] = useState<Admin>();
  const [searchType, setSearchType] = useState<TableType>(TableType.Customer);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.Ascending);
  const [priceRange, setPriceRange] = useState([0, 100]); 
  const [filter, setFilter] = useState<MembershipStatus|string>('All');
  const [numberOfProducts, setNumberOfProducts] = useState<number>(0);

  // Uses the useRouter hook to get the router object.
  // This is helpful for redirecting the user to a different page by its path.
  const router = useRouter();

  // This useEffect hook checks if the user is already logged in on initial render.
  // If the user is not logged in, redirect them to the login page.
  



  /**
   * Updates the priceRange state when the slider is moved.
   * 
   * @param event  The event that triggered the change.
   * @param newValue  The new value of the slider i.e. Array of numbers.
   */
  const handleSliderChange = (event: any, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  function handleFilterChange(event: any) {
    const value = event.target.value;
    console.log(value);
    setFilter(event.target.value);
  }

  /********************** Render Function **********************/
  return (
    <>
      <Nav />
      <main className="p-4 md:p-10 mx-auto max-w-full">
        <p className="text-6xl mb-4 text-center font-mono">Hello, User👋</p>
        
      </main>
    </>
  );
}



