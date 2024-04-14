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

interface IProps {
  sellerId: string;
}

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


  return (
    <Card className="w-full max-w-sm mx-auto bg-inherit rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="md:flex-shrink-0 object-cover items-center justify-center">
          <img
            alt="User's profile picture"
            className="h-48 w-full object-cover md:w-48"
            height={150}
            src={seller?.image as string}
            style={{
              aspectRatio: "150/150",
              objectFit: "cover",
            }}
            width={150}
          />
          {/* <Image
            alt="User's profile picture"
            className="h-48 w-full object-cover md:w-48 "
            height={140}
            src={seller?.image }
            width={140}
          /> */}

        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-primary font-semibold">{seller?.name}</div>
          <p className="mt-2 text-gray-500">
            {seller?.bio}
          </p>
          <p className="mt-2 text-gray-500">{seller?.contactDetails.address}</p>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex items-center mr-6 text-sm">
                <UsersIcon className="h-4 w-4 mr-2" />
                <span>1.2k Customers</span>
              </div>
              <div className="flex items-center text-sm">
                <ImageIcon className="h-4 w-4 mr-2" />
                <span>150 Listings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

function ImageIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}


function UsersIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}