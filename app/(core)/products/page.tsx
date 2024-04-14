/**
 * @fileoverview This file contains the product page. It displays the product specific information.
 */

// Directive to use client side rendering.
'use client';

// Imports.
import * as z from "zod";
import PaginationContainer from "@/components/PaginationContainer";
import Searchbar from "@/components/SearchBar";
import ApiConnector from "@/app/services/ApiConnector";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Product, QueryParams } from "@/shared/interfaces";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,    
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCategory, SortByFilter, SortOrder } from "@/shared/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { filterValidation } from "@/lib/validations/filter.validation";
import LoadingSpinner from "@/components/LoadingAnimations/LoadingSpinner";
import { Badge } from "@/components/ui/badge";

// Interface for the props of the ProductsPage component.
interface IProps {
  searchParams: { [key: string]: string | undefined };
}

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * This function renders the products page.
 * 
 * @param searchParams - The search parameters.
 * @returns The rendered products page.
 */
export default function ProductsPage({searchParams}: IProps) {
  const [result, setResult] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Add a new state variable to keep track of the applied filters
  const [appliedFilters, setAppliedFilters] = useState<string>('');

  // Get the search query from the URL.
  const search = searchParams.q;

  // Form validation.
  const form = useForm<z.infer<typeof filterValidation>>({
    resolver: zodResolver(filterValidation),
    defaultValues: {
      category: [ProductCategory.ALL],
      minPrice: 10,
      maxPrice: 100,
      sortBy: SortByFilter.NONE,
    },
  })

  // State variables.
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // On component mount set the categories that are displayed.
    if(form.getValues('category').includes(ProductCategory.ALL)) {
      form.setValue('category', Object.values(ProductCategory));
    }
    apiConnectorInstance.getProducts({
      name: search,
      page: searchParams.page ? +searchParams.page : 1,
      limit: 12,
      category: form.getValues('category') as ProductCategory[],
    })
    .then((response) => {
      if (response.success) {
        setResult(response.data);
        setTotalPages(response.totalPages!);
      }
    })
    .catch((error) => {
      console.error(error);
      setResult([]);
    });

  return function cleanup() {
    console.log('cleanup');
    setResult([]);
  }
  }, [searchParams]);

  /**
   * This function is called when the user submits the form.
   * It updates the user's password in the backend.
   * 
   * @param formData The form data.
   * @returns void
   */
  async function onSubmit(formData: any) {
    setOpen(false);
    // Construct the applied filters string
    let filters = '';
    if (formData.sortBy !== SortByFilter.NONE) {
      filters += ` Sorted by: ${formData.sortBy}`;
    }
    setAppliedFilters(filters);
    // If the user deselects all categories, we set the category to ALL.
    // This is done to ensure that the user can see all the products.
    if(form.getValues('category').length === 0) {
      form.setValue('category', Object.values(ProductCategory));
    } else if(form.getValues('category').includes(ProductCategory.ALL)) {
      // If the user selects all categories, we set the category to ALL.
      form.setValue('category', Object.values(ProductCategory));
    }
    // Delaying the form submission by 500ms to show the loading spinner.
    // This is done to handle the race condition between the loading spinner and the form submission.
    setTimeout(() => {
      const sortFilter = formData.sortBy;
      const queryParams: QueryParams = {
        name: search,
        page: searchParams.page ? +searchParams.page : 1,
        limit: 12,
        category: formData.category,
      };
      switch (sortFilter) {
        case SortByFilter.PRICE_LOW_TO_HIGH:
          queryParams.sortByPriceOrder = SortOrder.ASCENDING;
          break;
        case SortByFilter.PRICE_HIGH_TO_LOW:
          queryParams.sortByPriceOrder = SortOrder.DESCENDING;
          break;
        case SortByFilter.NEWEST:
          queryParams.sortByAvailableFromDate = SortOrder.DESCENDING;
          break;
        case SortByFilter.OLDEST:
          queryParams.sortByAvailableFromDate = SortOrder.ASCENDING;
          break;
        case SortByFilter.RATING_LOW_TO_HIGH:
          queryParams.sortByRatingOrder = SortOrder.ASCENDING;
          break;
        case SortByFilter.RATING_HIGH_TO_LOW:
          queryParams.sortByRatingOrder = SortOrder.DESCENDING;
          break;
        default:
          console.log('No sorting');
          break;
      }
      setIsLoading(true);
      // Now fetch the products based on the filters.
      apiConnectorInstance.getProducts(queryParams)
      .then((response) => {
        if (response.success) {
          setResult(response.data);
          setTotalPages(response.totalPages!);
        }
      })
      .catch((error) => {
        console.error(error);
        setResult([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
    }, 500);
  }

  /**
   * This function renders the password change form.
   * 
   * @param className The class name.
   * @returns The rendered password change form.
   */
  function renderFilterOptions(): React.ReactNode {
    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
             control={form.control}
              name="category"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Category</FormLabel>
                    <FormDescription> Choose the categories you want to see.</FormDescription>
                  </div>

                  {Object.values(ProductCategory).map((category) => (
                    <FormField
                      key={category}
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem
                          key={category}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              {...field}
                              value={category}
                              checked={form.getValues("category")?.includes(category)}
                              onCheckedChange={(checked) => { 
                                form.setValue("category", checked
                                  ? [...form.getValues("category"), category]
                                  : (form.getValues("category") || []).filter((c) => c !== category)
                                );
                                if(category === ProductCategory.ALL && checked) {
                                  form.setValue("category", Object.values(ProductCategory));
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {category}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    ))}
                  <FormMessage/>
                  </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sortBy"
              render={() => (
                <FormItem>
                  <FormLabel>Sort By</FormLabel>
                  <FormDescription> Choose the sorting criteria.</FormDescription>
                  <Select onValueChange={(val: SortByFilter) => {
                    form.setValue("sortBy", val);
                  }} defaultValue={form.getValues().sortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-900">
                      {Object.values(SortByFilter).map((sortBy) => (
                        <SelectItem key={sortBy} value={sortBy}>
                          {sortBy}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="default" onClick={()=>console.log(form.formState.errors)}>Apply Filters</Button>
        </form>
      </Form>
    )
  }

  /***************** Render Function **************/
  return (
    <MaxWidthWrapper>
      <LoadingSpinner display={isLoading} message='Finding the best products for you!'/>   
      <div className="flex flex-row mt-4">
        <div className=" flex-col space-y-4 w-full">
          <Searchbar searchType="products"/>
          <div className=" justify-center flex-row flex-wrap  text-lg space-x-3 space-y-3 max-w-6xl ml-8">
            {form.getValues('category').map((category) => ( category !== ProductCategory.ALL) && (
              <Badge key={category} className="h-6 ml-1" variant="default">{category}</Badge>
            ))}
          </div>
        </div>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant={"outline"} className="mt-2" onClick={()=> setOpen(true)}>
              <Filter className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className={"p-4"}>
            <DrawerHeader className="text-left">
              <DrawerTitle>Filter Options</DrawerTitle>
              <DrawerDescription>
                Select your preferred filters.
              </DrawerDescription>
            </DrawerHeader>
            {renderFilterOptions()}    
            <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        </div>
        {appliedFilters && (
            <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mt-20">
              Showing results {appliedFilters}
            </h1>
          </div>
        )}
        <div className='mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-9'>
          {result?.length === 0 ? (
            <p className='text-center text-base-regular text-light-3'>No Result</p>
          ) : (
            <>
              {result?.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </>
          )}
        </div>
        <PaginationContainer
          path='/products'
          page={searchParams.page ? +searchParams.page : 1}
          totalPages={totalPages}
        />
    </MaxWidthWrapper>
  );
}