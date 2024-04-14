/**
 * @fileoverview This file contains the pagination component used in the application.
 */

// Import the necessary modules.
import { useRouter } from "next/navigation";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";

// Interface for the props of the PaginationContainer component.
interface IProps {
  path: string;
  page: number;
  totalPages: number;
}

/**
 * This function renders the pagination container component.
 * 
 * @param path - The path to the page.
 * @param page - The current page.
 * @param totalPages - The total number of pages.
 * @returns The rendered pagination container.
 */
export default function PaginationContainer({ path, page, totalPages}: IProps) {
  const maxVisiblePages = typeof window !== 'undefined' && window.innerWidth < 768 ? 3 : 5;
  const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  const visiblePageNumbers = pageNumbers;

  // Get the router instance.
  const router = useRouter();

  /**
   * This function handles the page change event.
   * 
   * @param page - The new page.
   */
  function onPageChange(page: number) {
    // Parse the current URL query string
    const params = new URLSearchParams(window.location.search);
    
    // Check if the URL already contains the 'page' parameter
    if (params.has('q')) {
      // If it does, append the search query
      router.push(`${path}?page=${page}&q=${params.get('q')}`);
    } else {
      // If it doesn't, set the search query
      router.push(`${path}?page=${page}`);
    }
  }

  return (
    <Pagination className='mt-8'>
      <PaginationContent>
        {visiblePageNumbers[0] > 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={()=> {page >1 ? onPageChange(page-1): onPageChange(1)}} />
          </PaginationItem>
        )}
        {visiblePageNumbers[0] > 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {visiblePageNumbers.map((pageNum) => {
          const isActive = pageNum === page;
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink onClick={()=> onPageChange(pageNum)} className={isActive ? 'bg-primary text-white' : ''}>
                {pageNum}
              </PaginationLink>
            </PaginationItem>
        )})}
        {totalPages > visiblePageNumbers[visiblePageNumbers.length - 1] && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {totalPages > visiblePageNumbers[visiblePageNumbers.length - 1] && (
          <PaginationItem>
            <PaginationNext onClick={()=> page < totalPages ? onPageChange(page + 1) : onPageChange(totalPages)} />
          </PaginationItem>
          )
        }
      </PaginationContent>
    </Pagination>
  )
}