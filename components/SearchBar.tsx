/**
 * @fileoverview This file contains the search bar component used in the application.
 */
"use client";

// Imports
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";

// Interface for the props of the Searchbar component.
interface Props {
  searchType: string;
}

/**
 * This function renders the search bar component.
 * 
 * @param searchType - The type of search.
 * @returns The rendered search bar component.
 */
export default function Searchbar({ searchType }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // query after 0.3s of no input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (search !== "") {
        if (params.has('page')) {
          router.push(`/${searchType}?page=${params.get('page')}&q=${search}`);
        } else {
          router.push(`/${searchType}?q=${search}`);
        }
      } else {
        if (params.has('page')) {
          router.push(`/${searchType}?page=${params.get('page')}`);
        } else {
          router.push(`/${searchType}`);
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, searchType]);

  return (
    <div className='relative flex items-center flex-grow gap-1 rounded-lg bg-inherit px-4 py-2 w-18'>
    <SearchIcon size={23} className='absolute left-6' />
    <Input
      id='text'
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder={`${
        searchType == "products" ? "Search Products" : "Search Farmers"
      }`}
      className='pl-12 no-focus border-none bg-dark-3 text-base-regular text-light-4 outline-none'
    />
  </div>
  );
}