/**
 * @fileoverview This file conatins the page for the seller listings.
 * This page allows the seller to view and manage their listings.
 * 
 * Note: This route is middleware protected and only accessible to sellers.
 */

'use client';

// Imports
import ApiConnector from "@/app/services/ApiConnector";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { TableHead, TableRow, TableHeader, Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button"
import ListingsItemComponent from "@/components/ListingsItemComponent";
import { useEffect, useState } from "react";
import { ListingsItem } from "@/shared/interfaces";
import { useRouter } from "next/navigation";
import { Frown, Plus } from "lucide-react";
import LoadingSpinner from "@/components/LoadingAnimations/LoadingSpinner";
import { useToast } from "@/components/ui/use-toast";
import { ToastType } from "@/shared/constants";

const apiConnectorInstance = ApiConnector.getInstance();

export default function Listings() {
  const [listings, setListings] = useState<ListingsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  /**
   * This function fetches the user's listings from the server.
   */
  async function fetchData() {
    setLoading(true);
    try {
      const session = await apiConnectorInstance.getCurrentUserFromSession();
      const listings = await apiConnectorInstance.getProducts({sellerId: session.id});
      setListings(listings.data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An error occurred while fetching the data. Please try again later.",
        variant: ToastType.DESTRUCTIVE,
      });
    } finally {
      setLoading(false);
    }
  }

  // On component mount, fetch the data.
  useEffect(() => {
    try {
     fetchData();
    } finally {
      setLoading(false);
    }
    // Cleanup function.
    return function cleanup() {
      setListings([]);
      setLoading(false);
    }
  }, []);

  // If there are no listings, then display this message.
  if ((!listings || listings.length === 0) && !loading) {
    return (
      <MaxWidthWrapper>
        <div className="flex justify-center items-center h-[50vh]">
          <div className="flex flex-col items-center gap-4">
          <Frown
              size={80}
              className="text-dark-3"
          />
            <h1 className="font-semibold text-2xl md:text-3xl">Currently you have no listings</h1>
            <Button size="lg" onClick={()=>{
              setLoading(true);
              router.push("/listings/create")
            }}>
              Create my first listing
            </Button>
          </div>
        </div>
      </MaxWidthWrapper>
    );
  }

  /**
   * This function is used to remove a product from the listings.
   * 
   * @param id The id of the product to be removed.
   */
  function onListingRemove(id: string) {
    setLoading(true);
    apiConnectorInstance.deleteProduct(id)
    .then((response) => {
      // After the product is deleted, refetch the data.
      fetchData();
      toast({
        title: "Success",
        description: response.message,
        variant: ToastType.DEFAULT,
      })
    })
    .catch((response) => {
      toast({
        title: "Error",
        description: response.message,
        variant: ToastType.DESTRUCTIVE,
      });
    })
    .finally(() => {
      setLoading(false);
    });
  }

  return (
    <MaxWidthWrapper>
      <LoadingSpinner display={loading}  message="Grabbing your listings from our servers..." />
      <div className="grid gap-6 p-6">
        <h1 className="font-semibold text-2xl md:text-3xl">My Listings</h1>
        <div className="border shadow-sm rounded-lg overflow-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead className="flex-grow ">Product</TableHead>
                <TableHead className="w-30">Category</TableHead>
                <TableHead className="w-30">Sale Price</TableHead>
                <TableHead className="w-30">Market Price</TableHead>
                <TableHead className="w-30">Quantity</TableHead>
                <TableHead className="w-30">Available From</TableHead>
                <TableHead className="w-30">Listed At</TableHead>
                <TableHead className="w-30">Total</TableHead>
                <TableHead className="w-[60px]"> Actions </TableHead>
              </TableRow>
            </TableHeader>
            {listings && listings.length >0 && listings.map((item: any, index: number) => {
              return (
                <ListingsItemComponent
                  key={index}
                  item={item}
                  onClick={() => router.push(`/products/${item.id}`)}
                  onEdit={() => router.push(`/listings/create?edit=true&product_id=${item.id}`)}
                  onRemove={() => onListingRemove(item.id)}
                />
              )
            })}
          </Table>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-2xl font-semibold">Estimated Revenue: £{(listings.reduce((acc, item) => acc + item.salePrice * item.quantity, 0)).toFixed(2)} /-</div>
          <Button className="ml-auto" size="lg" onClick={()=>{
            router.push("/listings/create")
          }}>
            <Plus size={24} className="mr-2" />
            Create New Listing
          </Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}