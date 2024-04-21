/**
 * @fileoverview This file conatins the SellerProfileCard component.
 */

'use client';

import ApiConnector from "@/app/services/ApiConnector";
// Importing necessary libraries and components.
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/shared/interfaces";
import { BoxIcon, MapPin, Package, UsersIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

interface IProps {
  sellerId: string;
}

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

export default function SellerProfileCard({sellerId}: IProps) {
  const [seller, setSeller] = useState<User | null>(null);

  // On component mount, fetch the seller's data from the server.
  useEffect(() => {
    async function fetchSellerData() {
      // Fetch the seller's data from the server.
      const res = await apiConnectorInstance.getUserFromId(sellerId);
      if (res.success) {
        // Set the seller's data.
        setSeller(res.data);
      } else {
        // If the request fails, set the seller's data to null.
        setSeller(null);
      }
    }
    // Fetch the seller's data.
    fetchSellerData();

    // Cleanup function.
    return function cleanup() {
      setSeller(null);
    }
  }, []);

  /************************ Render Function *********************/
  return (
    <Card className="w-full max-w-sm mt-8 mx-auto bg-inherit rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="md:flex-shrink-0 object-cover items-center justify-center">
          <Image
            alt="User's profile picture"
            className="h-full w-full object-cover md:w-48"
            height={150}
            src={seller?.image as string}
            width={150}
          />
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-lg text-primary font-semibold">{seller?.name}</div>
          <p className="mt-2 dark:text-gray-300 text-gray-800">
            {seller?.bio}
          </p>
          <div className="flex mt-4 items-center mr-6 text-md">
            <MapPin className="h-6 w-6 mr-2" />
            <span>{seller?.contactDetails.address}</span>
          </div>
          <div className="mt-6">
            <div className=" flex flex-row gap-10 mb-4 justify-start">
              <div className="flex items-center  text-md">
                <UsersIcon className="h-6 w-6 mr-2" />
                <span>{seller?.roleSpecificData?.customersServed ? seller?.roleSpecificData?.customersServed +" customers" : "N/A"}</span>
              </div>
              <div className="flex items-center text-md">
                <BoxIcon className="h-6 w-6 mr-2" />
                <span>{seller?.roleSpecificData?.productsSold ? seller?.roleSpecificData?.productsSold +" sold" : "N/A"}</span>
              </div>
              <div className="flex items-center text-md">
                <Package className="h-6 w-6 mr-2" />
                <span>{seller?.roleSpecificData?.currentListings ? seller?.roleSpecificData?.currentListings + " active" : "N/A"}</span>
              </div>
            </div>
            <div>
            <Link className=" dark:text-gray-200 text-black hover:text-orange-400 dark:hover:text-orange-500" href={`/products?seller=${sellerId}`}>
              See all products by this seller?
            </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
