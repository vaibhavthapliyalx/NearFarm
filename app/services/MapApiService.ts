/**
 * @fileoverview This file contains the MapApi class.
 * This class is used to connect to the Server.
 */

import { Location } from "@/shared/interfaces";
import axios from "axios";

// Importing necessary libraries and modules.

/**
 * @class MapApi  
 * This class handles all the MapApi calls to the Google Maps API.
 * 
 * This class is an interface between the frontend and the backend.
 * This class wraps all the functions that are used to connect to the backend.
 * This class is a singleton, i.e. only one instance of this class is created.
 * This helps in maintaining a single connection and prevents threading issues.
 */
export default class MapApi {
  // Singleton instance of MapApi class.
  private static instance: MapApi;
  private googleMapsApiKey: string;
  private googleMapsApiBaseUrl: string;

  // Private constructor to prevent multiple instances of MapApi class.
  private constructor() {
    console.log("MapApi initalised!");
    this.googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
    this.googleMapsApiBaseUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_BASE_URL!;
  }

  /**
   * Gets the instance of MapApi class.
   * If the instance is not created, it creates a new instance.
   * If the instance is already created, it returns the existing instance.
   * 
   * @returns MapApi Instance
   */
  public static getInstance(): MapApi {
    if (!MapApi.instance) {
      MapApi.instance = new MapApi();
    }
    return MapApi.instance;
  }

  /**
   * This function fetches the user's location from the current device.
   * 
   * @param userId The id of the user.
   * @returns The user's location.
   */
  async getCurrentLocation(): Promise<any> {
    // Fetch the user's location.
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(position);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * This function fetches the coordinates of the given address.
   * 
   * @param address  The address to get the coordinates for.
   * @returns  The coordinates of the address.
   */
  public async getCoordinatesFromAddress(address: string): Promise<Location | undefined> {
    try {
      const response = await axios.get(`${this.googleMapsApiBaseUrl}/geocode/json`, {
        params: {
          address: address,
          key: this.googleMapsApiKey
        }
      });
      if (response.data.status === 'OK') {
        const location = response.data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      } else {
        console.error(`Failed to get coordinates for address: ${address}`);
        return undefined;
      }
    } catch (error) {
      console.error(`Failed to get coordinates for address: ${address}`, error);
      return undefined;
    }
  }

  /**
   * This function fetches the address from the given coordinates.
   * 
   * @param lat The latitude of the location.
   * @param lng The longitude of the location.
   * @returns The address of the location.
   */
  async getAddressesFromCoordinates(lat: number, lng: number): Promise<any> {
    return new Promise((resolve, reject) => {
      axios.get(`${this.googleMapsApiBaseUrl}/geocode/json`, {
        params: {
          latlng: `${lat},${lng}`,
          key: this.googleMapsApiKey
        }
      })
      .then((response) => {
        if (response.data.status === 'OK') {
          resolve(response.data.results[0].formatted_address);
        } else {
          reject(response.data.error_message);
        }
      })
      .catch((error) => {
        reject(error);
      });
    });
  }

  /**
   * This function fetches the city from the given coordinates.
   * 
   * @param lat The latitude of the location.
   * @param lng The longitude of the location.
   * @returns The city of the location.
   */
  async getCityFromCoordinates(lat: number, lng: number): Promise<any> {
    return new Promise((resolve, reject) => {
      axios.get(`${this.googleMapsApiBaseUrl}/geocode/json`, {
        params: {
          latlng: `${lat},${lng}`,
          key: this.googleMapsApiKey
        }
      })
      .then((response) => {
        if (response.data.status === 'OK') {
          const results = response.data.results;
          for (let i = 0; i < results.length; i++) {
            const types = results[i].types;
            if (types.includes('administrative_area_level_2') || types.includes('administrative_area_level_1')) {
              resolve(results[i].formatted_address);
              break;
            }
          }
          resolve(results[0].formatted_address);
        } else {
          reject(response.data.error_message);
        }
      })
      .catch((error) => {
        reject(error);
      });
    });
  }
}