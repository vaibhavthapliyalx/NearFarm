/**
 * @fileoverview This file contains the map renderer component.
 * 
 * This component renders the map on the screen.
 */
'use client';

// Imports
import  { useEffect, useState } from "react";
import { GoogleMap, Marker, OverlayView } from '@react-google-maps/api';
import MapApi from "@/app/services/MapApiService";
import { Location, UserLocation } from "@/shared/interfaces";
import ApiConnector from "@/app/services/ApiConnector";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import SellerProfileToolTip from "./SellerProfileToolTip";
import { useJsApiLoader } from "@react-google-maps/api";
import { MapType } from "@/shared/constants";

// Gets the instance of the MapApi class (Singleton) which gives access to map related functions.
const mapApiInstance = MapApi.getInstance();

// Gets the instance of the ApiConnector class (Singleton) which connects to the backend endpoints.
const apiConnectorInstance = ApiConnector.getInstance();

// Interface for the props of the MapRenderer component.
interface IProps {
  onDismiss: () => void;
  containerStyle: React.CSSProperties;
  type: MapType;
  customCoordinates?: UserLocation[];
}

/**
 * This function renders the map component.
 * 
 * @param onDismiss - The function to dismiss the map.
 * @returns The rendered map component.
 */
export default function MapRenderer({onDismiss, containerStyle, type, customCoordinates}: IProps) {
  const [currentLocation, setCurrentLocation] = useState<Location>();
  const [locations, setLocations] = useState<UserLocation[]>(customCoordinates || []);
  const [isLoading, setIsLoading] = useState(true);
  const markerUrl = `/assets/icons/${type}-marker.svg`
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['geometry', 'drawing'],
    mapIds: [process.env.NEXT_PUBLIC_GOOGLE_MAP_ID!],
  }); 
  
  // This function is called when the component is rendered.
  useEffect(() => {
    async function fetchCurrentLocation() {
      const location = await mapApiInstance.getCurrentLocation();
      setCurrentLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });
    }

    /**
     * This function fetches the coordinates of all the sellers from the server.
     */
    async function fetchCoordinates() {
      const response = await apiConnectorInstance.fetchAllSellerLocations();
      if (!response.success) {
        return;
      } 
      setLocations(response.data);
    }
    fetchCurrentLocation();

    if (!customCoordinates && type === MapType.NEARBY_SELLERS) {
      try {
        fetchCoordinates();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setLocations(customCoordinates || []);
      setIsLoading(false);
    }
    // Cleanup function.
    return function cleanup() {
      setLocations([]);
      setIsLoading(false);
    }
  }, [customCoordinates]);

  // If the map is still loading, show a loading message.
  if (isLoading && !isLoaded) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {isLoaded  && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentLocation}
          zoom={10}
        >
          { locations.map((location, index) => (
              <Marker
                key={index}
                position={location.coordinates}
                onClick={()=> setCurrentLocation(location.coordinates)}
                icon={{
                  url: markerUrl,
                  scaledSize: typeof google === 'object' ? new google.maps.Size(50, 50) : undefined
                }}
              >
                {currentLocation === location.coordinates && type === MapType.NEARBY_SELLERS && (
                <OverlayView
                  key={index}
                  position={location.coordinates}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                <div>
                  <SellerProfileToolTip sellerId={location.userId} className="w-80 h-30" onDismiss={onDismiss} />
                  <Button className="absolute top-1 left-72 text-black dark:text-white hover:text-red-600  p-1 rounded-full" variant={'ghost'} onClick={() => setCurrentLocation(undefined)}>
                    <X size={15}/>
                  </Button>
                </div>
              </OverlayView>
                )}
              </Marker>
            ))
          }
        </GoogleMap>
      )}
    </>
  );
}