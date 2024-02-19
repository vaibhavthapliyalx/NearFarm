// Main API connector class.

import axios from "axios";
import {getSession, signIn, signOut} from "next-auth/react";
import { ResetPasswordPayload, User } from "../../shared/interfaces";
import type { NextApiRequest } from "next";

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

  /**
   * This function sends a GET request to the server to get the database connection status
   * by pinging the database.
   * 
   * @returns Promise<void> - The promise resolves if the database is connected, otherwise it rejects.
   */
  async getDatabaseConnectionStatus() : Promise<void> {
    return new Promise<void>((resolve, reject) => {
      axios.get('/api/connection/database')
      .then((result:any) => {
        resolve(result);
      })
      .catch((result:any) => {
        reject(result.response.data);
      })
    })
  }

  /**
  * This function sends a GET request to the server to get the server connection status.
  * 
  * @returns Promise<void> - The promise resolves if the server is connected, otherwise it rejects.
  */
  async getServerConnectionStatus() : Promise<void> {
    return new Promise<void>((resolve, reject) => {
      axios.get('/api/connection/server')
      .then((result:any) => {
        resolve(result);
      })
      .catch((result:any) => {
        reject(result.response.data);
      })
    })
  }

  /**
    * This function sends a POST request to the server to create a new user.
    * 
    * @param data - The data to be sent to the server.
    * @returns Promise<void> - The promise resolves if the user is created successfully, otherwise it rejects.
    */
  async signup(data: User) : Promise<any> {
    return new Promise<any>((resolve, reject) => {
      axios.post('/api/auth/signup', {
        name: data.name,
        userType: data.userType,
        email: data.email,
        password: data.password,
        createdAt: data.createdAt,
      })
      .then(async (response:any) => {
        console.log(response.data);
        if (response.data.status !== 200) {
          reject(response.data.error);
        }
        resolve(response.data)
      })
      .catch((response:any) => {
        console.log(response.data.error);
        reject(response.data.error);
      })
    })
  }


  /**
    * This function sends a POST request to the server to login a user.
    * 
    * @param data - The data to be sent to the server.
    * @param provider - The provider to be used for authentication.
    * 
    * @returns Promise<void> - The promise resolves if the user is logged in successfully, otherwise it rejects.
    */
  async login(data: User, provider: any) : Promise<void> {
    return new Promise<void>((resolve, reject) => {
      axios.post('/api/auth/login', {
        email: data.email,
        password: data.password,
      })
      .then((response:any) => {
        console.log(response);
        

        if (response.data.status !== 200) {
          reject(response.data.error);
        }

        if (response.data.status === 200) {
          resolve(response.data)

          // Sign in the user.
          signIn(provider,{
            email: data.email,
            password: data.password,
            callbackUrl: "/",
            redirect: true
          })
        }

      })
      .catch((result:any) => {
        console.log(result);
        reject(result.data.error);
      })
    })
  }

  /**
    * This function sends a GET request to the server to logout a user.
    * 
    * @returns Promise<void> - The promise resolves if the user is logged out successfully, otherwise it rejects.
    */
  async logout() : Promise<void> {
    return new Promise<void>((resolve, reject) => {
      signOut({callbackUrl: '/login', redirect: true})
      .then((result:any) => {
        resolve(result);
      })
      .catch((result:any) => {
        reject(result);
      });
    })
  }

  /**
    * This function sends a GET request to the server to get the user data.
    * @ param email - The email of the user whose data is to be fetched.
    * 
    * @returns Promise<any> - The promise resolves if the user data is fetched successfully, otherwise it rejects.
    */
  async getUserFromEmail(email: string) : Promise<any> {
    return new Promise<any>((resolve, reject) => {
      axios.get('/api/user', { params: { email } })
      .then((result:any) => {
        resolve(result.data.data);
      })
      .catch((result:any) => {
        reject(result.response.data);
      })
    })
  }


  async getCurrentUserFromSession(req?: NextApiRequest) {
    let  session = {} as any;
    if (!req) {
      session = await getSession();
    } else {
      session = await getSession({ req });
    }
    console.log(session);
    return session?.user;
  }

  /**
   * This function sends the request to Google to login a user.
   */
  async loginWithGoogle() {
    await signIn("google", {
      callbackUrl: "/",
      redirect: true,
    })
  }

  /**
   * This function sends the request to Github to login a user.
   */
  async loginWithGithub() {
    await signIn("github", {
      callbackUrl: "/",
      redirect: true,
    })
  }

  /**
   * This function sends a POST request to the server to reset the password of a user.
   * This function is used when the user forgets the password and wants to reset it.
   * 
   * @param email - The email of the user whose password is to be reset.
   * 
   * @returns Promise<void> - The promise resolves if the password is reset successfully, otherwise it rejects.
   */

  async forgotPassword(email: any) : Promise<any> {
    console.log("Interface received the request to reset the password.");
    return new Promise<any>((resolve, reject) => {
      axios.post('/api/auth/forgot-password', {
        email: email,
      })
      .then((result:any) => {
        const response = result.data;
        console.log("This is response.data");
        console.log(response);


        if (response.status === 400) {
          // User not found.
          reject(response);
        } else if (response.status === 200) {
          // User received the email.
          resolve(response);
        } else {
          // User did not receive the email.
          reject(response);
        }

        resolve(response);
      })
      .catch((result:any) => {
        console.log("This is error object");
        console.log(result);
        reject(result.response.data);
      })
    });
  }

  /**
   * This function sends a POST request to the server to reset the password of a user.
   * This function is used when the user forgets the password and wants to reset it.
   * 
   * @param email - The email of the user whose password is to be reset.
   * @param password - The new password of the user.
   * @param token - The reset password token.
   * 
   * @returns Promise<void> - The promise resolves if the password is reset successfully, otherwise it rejects.
   */
  async resetPassword(payload: ResetPasswordPayload) : Promise<any> {
    return new Promise<any>((resolve, reject) => {
      // Before sending the request to the server, check if the password and confirm password match.
      if (payload.password !== payload.confirmPassword) {
        reject({
          status: 400,
          message: "Oops! The passwords do not match. Please try again."
        });
      }
      axios.post('/api/auth/reset-password', {
        email: payload.email,
        password: payload.password,
        signature: payload.signature
      })
      .then((result:any) => {
        console.log(result);
        const response = result.data;
        if (response.status === 400) {
          // User not found.
          reject(response);
        } else if (response.status === 200) {
          // User received the email.
          resolve(response);
        }
      })
      .catch((result:any) => {
        console.log("This is error object");
        console.log(result);
        reject(result);
      })
    });
  }
}