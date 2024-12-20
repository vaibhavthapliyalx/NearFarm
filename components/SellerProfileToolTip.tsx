/**
 * @fileoverview This file contains the SellerProfileToolTip component.
 */

// Directive to use client side rendering.
'use client';

// Imports
import ApiConnector from "@/app/services/ApiConnector";
import { User } from "@/shared/interfaces";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { BoxIcon, Package, UsersIcon, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

// Interface for the props of the SellerProfileToolTip component.
interface IProps {
  sellerId: string;
  className?: string;
  onDismiss: () => void;
  onInfoDismiss: () => void;
}
// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

/**
 * This function renders the seller profile tooltip.
 * 
 * @param sellerId The id of the seller.
 * @param className The tailwind classes to apply to the tooltip.
 * @param onDismiss The function to call when the tooltip is dismissed.
 * @param onInfoDismiss The function to call when the info button is dismissed.
 * @returns 
 */
export default function SellerProfileToolTip({ sellerId, className, onDismiss, onInfoDismiss}: IProps) {
  // State variables.
  const [seller, setSeller] = useState<User | null>(null);

  // On component mount, fetch the seller's data from the server.
  useEffect(() => {
    async function fetchSellerData() {
      const res = await apiConnectorInstance.getUserFromId(sellerId);
      if (res.success) {
        setSeller(res.data);
      } else {
        setSeller(null);
      }
    }
    fetchSellerData();
    return function cleanup() {
      setSeller(null);
    }
  }, []);

  /************************ Render Function *********************/
  return (
    <Card className={`relative ${className} pt-2 bg-white  dark:bg-gray-800 rounded-lg shadow-md border-none min-w-fit`}>
      <CardHeader>
      <Button className="absolute top-2 right-2 text-black dark:text-white hover:text-red-600 p-1 rounded-full" variant={'ghost'} onClick={onInfoDismiss}>
        <X size={15}/>
      </Button>
      </CardHeader>
      <CardContent className="flex mt-[-40px] items-start space-x-2 w-full">
        <Image
          src={seller?.image as string || "/assets/icons/user.svg"}
          alt={seller?.name as string || "User"}
          width={60}
          height={60}
          className="rounded-full"
          objectFit="cover"
        />
        <div className="flex flex-col gap-1">
          <div>
            <span className="text-lg font-semibold">{seller?.name}</span>
          </div>
          <div className="flex items-center text-sm">
            <span>{seller?.contactDetails.address}</span>
          </div>
          <div className="mt-4">
            <div className=" flex flex-row gap-8 ml-[-55px] justify-start">
              <div className="flex items-center  text-sm">
                <UsersIcon className="h-4 w-4 mr-2" />
                <span className="whitespace-nowrap">{seller?.roleSpecificData?.customersServed ? seller?.roleSpecificData?.customersServed +" customers" : "N/A"}</span>
              </div>
              <div className="flex items-center text-sm">
                <BoxIcon className="h-4 w-4 mr-2" />
                <span className="whitespace-nowrap">{seller?.roleSpecificData?.productsSold ? seller?.roleSpecificData?.productsSold + " sold" : "N/A"}</span>
              </div>
              <div className="flex items-center text-sm">
                <Package className="h-4 w-4 mr-2" />
                <span className="whitespace-nowrap">{seller?.roleSpecificData?.currentListings ? seller?.roleSpecificData?.currentListings + " active" : "N/A"}</span>
              </div>
            </div>
            <div>
            
            </div>
          </div>
          <Link className=" dark:text-gray-200 text-black hover:text-orange-400 dark:hover:text-orange-500 text-sm ml-[-55px]" href={`/products?seller=${sellerId}`} onClick={onDismiss}>
            See all products by this seller?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}