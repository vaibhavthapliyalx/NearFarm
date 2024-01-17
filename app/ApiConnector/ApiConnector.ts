// Main API connector class.

// Imports
// import axios from "axios";
// import qs from "qs";


/**
 * @class ApiConnector
 * This class handles all the API calls to the server.
 * 
 * This class is an interface between the frontend and the backend.
 * This class wraps all the functions that are used to connect to the backend.
 * This class is a singleton, i.e. only one instance of this class is created.
 * This helps in maintaining a single connection and prevents threading issues.
 */
export default class ApiConnector {
  // Singleton instance of ApiConnector class.
  private static instance: ApiConnector; 

  // Private constructor to prevent multiple instances of ApiConnector class.
  private constructor() {
    console.log("ApiConnector initalised!");
  }

  /**
   * Gets the instance of ApiConnector.
   * If the instance is not created, it creates a new instance.
   * If the instance is already created, it returns the existing instance.
   * 
   * @returns ApiConnector Instance
   */
  public static getInstance(): ApiConnector {
    if (!ApiConnector.instance) {
      ApiConnector.instance = new ApiConnector();
    }
    return ApiConnector.instance;
  }

  // /**
  //  * This function sends a GET request to the server to get the database connection status
  //  * by pinging the database.
  //  * 
  //  * @returns Promise<void> - The promise resolves if the database is connected, otherwise it rejects.
  //  */
  //  async getDatabaseConnectionStatus() : Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     axios.get('/api/db_connectivity')
  //     .then((result:any) => {
  //       resolve(result);
  //     })
  //     .catch((result:any) => {
  //       reject(result.response.data);
  //     })
  //   })
  //  }

  //  /**
  //   * This function sends a GET request to the server to get the server connection status.
  //   * 
  //   * @returns Promise<void> - The promise resolves if the server is connected, otherwise it rejects.
  //   */
  //  async getServerConnectionStatus() : Promise<void> {
  //   return new Promise<void>((resolve, reject) => {
  //     axios.get('/api/server_connectivity')
  //     .then((result:any) => {
  //       resolve(result);
  //     })
  //     .catch((result:any) => {
  //       reject(result.response.data);
  //     })
  //   })
  //  }
}