/**
 * @fileoverview This file contains the NearbySellerCard component. 
 * This component is used to display the nearby sellers in the home screen.
 */
'use client';

// Importing necessary libraries and components.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User, UserLocation } from "@/shared/interfaces";
import { Button } from "./ui/button";
import ApiConnector from "@/app/services/ApiConnector";
import MapApi from "@/app/services/MapApiService";
import { calculateDistanceBetweenTwoCoordinates } from "@/lib/utilityfunctions";
import { useRouter } from "next/navigation";

// Grabs the instance of the ApiConnector Class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

// Grabs the instance of the MapApi Class (Singleton) which connects to the Google Maps API.
const mapApiInstance = MapApi.getInstance();

export default function NearbySellers() {
  const [sellers, setSellers] = useState<{ seller: User; location: string; distance: number}[]>([]);

  // Get the router instance.
  const router = useRouter();

  // On component mount, fetch the seller's data from the server.
  useEffect(() => {
    async function fetchSellers() {
      const res = await apiConnectorInstance.fetchAllSellerLocations();
      if (res.success) {
        const sellerPromises = res.data.map(async (sellerObj: UserLocation) => {
          try {
            const userRes = await apiConnectorInstance.getUserFromId(sellerObj.userId);
            if (userRes.success && sellerObj.coordinates) {
              const currentUserLocation = await mapApiInstance.getCurrentLocation();
              const distanceInMetres = calculateDistanceBetweenTwoCoordinates(
                sellerObj.coordinates,
                {
                  lat: currentUserLocation.coords.latitude,
                  lng: currentUserLocation.coords.longitude
                }
              );
              const distanceInMiles = Math.round(distanceInMetres * 0.000621371)
              return {
                seller: userRes.data,
                location: `${distanceInMiles} miles away`,
                distance: distanceInMiles
              };
            }
          } catch (error) {
            console.error('Error fetching seller or current location:', error);
          }
        });
        const sellerResults = await Promise.all(sellerPromises);
        const sellers = sellerResults.filter(Boolean); // Remove any undefined values
          // Sort the sellers by distance
          sellers.sort((a, b) => a.distance - b.distance);
        setSellers(sellers);
      }
    }
    // Fetch the seller's data.
    fetchSellers();
  
    // Cleanup function.
    return function cleanup() {
      setSellers([]);
    }
  }, []);

  /********************** Render Function *******************/
  return (
    <Card className="bg-inherit border border-orange-200 mt-6">
      <CardHeader>
        <CardTitle>Nearby Farmers</CardTitle>
        <CardDescription>View products from farmers in your local area.</CardDescription>
      </CardHeader>
      <CardContent>
        {sellers.map((item) => (
          <div className=" gap-6 mb-4" key={item.seller.id}>
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
              <Avatar>
                <AvatarImage height={64} width={64} src={item.seller?.image as string} alt={item.seller?.name as string} />
                <AvatarFallback>{item.seller?.name.split(' ').map((name) => name[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{item.seller?.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.location}
                </p>
              </div>
              <Button onClick={()=> router.push(`/products?seller=${item.seller.id}`)} size="sm">View</Button>
            </div>
          </div>
      ))}
      </CardContent>
    </Card>
  )
}
          
      