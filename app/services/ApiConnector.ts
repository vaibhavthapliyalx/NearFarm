/**
 * @fileoverview This file contains the ApiConnector class.
 * This class is used to connect to the Server.
 */

// Imports
import axios from "axios";
import { getSession, signIn, signOut } from "next-auth/react";
import { ApiResponse, ChangePasswordPayload, ResetPasswordPayload, User } from "../../shared/interfaces";
import type { NextApiRequest } from "next";
import { ProviderType } from "@/shared/constants";

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
   * Gets the instance of ApiConnector class.
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
   * This function sends a GET request to the server to get the application version.
   * 
   * @description
   * This function is used to get the application version from the server.
   * The server reads the version from the package.json file and sends it as a response.
   * The version is read in this way to ensure security by not exposing the package.json file
   * directly to the client.
   * 
   * @returns Promise<ApiResponse> - The promise resolves if the application version is fetched successfully, otherwise it rejects.
   */
  async getAppVersion() : Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.get('/api/app-version')
      .then((res: any) => {
        const response = res.data.body;
        // If the response is not successful, reject the promise.
        if (!response.success) {
          reject(response);
        }
        // If the response is successful, resolve the promise.
        resolve(response);
      })
      .catch((result:any) => {
        // In case of an error, reject the promise.
        reject(result.response.data);
      })
    })
  }

  /**
   * This function sends a GET request to the server to get the database connection status
   * by pinging the database.
   * 
   * @returns Promise<void> - The promise resolves if the database is connected, otherwise it rejects.
   */
  async getDatabaseConnectionStatus() : Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.get('/api/connection/database')
      .then((res:any) => {
        const response = res.data.body;
        // If the response is not successful, reject the promise.
        if (!response.success) {
          reject(response);
        }
        // If the response is successful, resolve the promise.
        resolve(response);
      })
      .catch((result:any) => {
        // In case of an error, reject the promise.
        reject(result.response.data);
      })
    })
  }

  /**
   * This function sends a GET request to the server to get the server connection status.
   * 
   * @returns Promise<ApiResponse> - The promise resolves if the server is connected, otherwise it rejects.
   */
  async getServerConnectionStatus() : Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.get('/api/connection/server')
      .then((res:any) => {
        const response = res.data.body;
        // If the response is not successful, reject the promise.
        if (!response.success) {
          reject(response);
        }
        // If the response is successful, resolve the promise.
        resolve(response);
      })
      .catch((result:any) => {
        // In case of an error, reject the promise.
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
  async signup(data: User) : Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.post('/api/auth/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
        joinDate: data.joinDate,
      })
      .then((res:any) => {
        const response = res.data.body;
        // If the response is not successful, reject the promise.
        if (!response.success) {
          reject(response);
        } else {
          // If the response is successful, resolve the promise.
          resolve(response);
        }
      })
      .catch((result:any) => {
        // In case of an error, reject the promise.
        reject(result.response.data);
      })
    })
  }

  /**
   * This function sends a POST request to the server to login a user.
   * 
   * @param data - The data to be sent to the server.
   * @param provider - The provider to be used for authentication. i.e. credentials, google, github.
   * 
   * @returns Promise<ApiResponse> - The promise resolves if the user is logged in successfully, otherwise it rejects.
   */
  async login(provider: ProviderType, data?: User) : Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve, reject) => {
      // If the provider is credentials, send a POST request to the server to login the user.
      if (data && provider === ProviderType.CREDENTIALS) {
        axios.post('/api/auth/login', {
          email: data.email,
          password: data.password,
        })
        .then((res: any) => {
          const response = res.data.body;
          // If the response is not successful, reject the promise.
          if (!response.success) {
            reject(response);
          } else {
            // Sign in the user.
            signIn(provider, {
              id: response._id,
              email: data.email,
              password: data.password,
              callbackUrl: "/",
              redirect: true
            })
            resolve(response);
          }
        })
        .catch((result:any) => {
          reject(result.response.data);
        });

        // If the provider is google or github, sign in the user using the provider.
      } else if (provider === ProviderType.GOOGLE || provider === ProviderType.GITHUB) {
        signIn(provider, {
          callbackUrl: "/",
          redirect: true,
        })
      } else {
        console.log("Invalid provider");
      }
    })
  }

  /**
   * This function sends a GET request to the server to logout a user.
   * 
   * @returns Promise<void> - The promise resolves if the user is logged out successfully, otherwise it rejects.
   */
  async logout(): Promise<void> {
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
  async getUserFromEmail(email: string): Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.get('/api/user', { params: { email: email } })
      .then((res: any) => {
        const response = res.data.body;
        response.data.id = response.data._id;
        // If the response is not successful, reject the promise.
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result: any) => {
        reject(result.response.data);
      })
    })
  }

  /**
   * This function uses the next-auth getSession function to get the current user from the session.
   * 
   * 
   * @param req - The request object.
   * @returns  User - The user object.
   */
  async getCurrentUserFromSession(req?: NextApiRequest) {
    let  session = null;
    if (!req) {
      session = await getSession();
    } else {
      session = await getSession({ req });
    }
    if (!session) {
      console.log("No session found");
      return null;
    }
    return session?.user;
  }


  /**
   * This function sends a POST request to the server to reset the password of a user.
   * This function is used when the user forgets the password and wants to reset it.
   * 
   * @param email - The email of the user whose password is to be reset.
   * @returns Promise<ApiResponse> - The promise resolves if the password is reset successfully, otherwise it rejects.
   */
  async forgotPassword(email: any) : Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.post('/api/auth/forgot-password', { email: email })
      .then((res:any) => {
        const response = res.data.body;
        // If the response is not successful, reject the promise.
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result:any) => {
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
   * @returns Promise<ApiResponse> - The promise resolves if the password is reset successfully, otherwise it rejects.
   */
  async resetPassword(payload: ResetPasswordPayload) : Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve, reject) => {
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
      .then((res: any) => {
        const response = res.data.body;
        // If the response is not successful, reject the promise.
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result:any) => {
        console.log(result);

        reject(result.response.data);
      })
    });
  }

  /**
   * This function sends a PUT request to the server to change the password of a user.
   * This function is used when the user wants to change the password.
   * 
   * @param payload - The data to be sent to the server.
   * 
   * @returns Promise<ApiResponse> - The promise resolves if the password is changed successfully, otherwise it rejects.
   */
  async changePassword(payload: ChangePasswordPayload) : Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.put('/api/auth/change-password', {
        id: payload.id,
        oldPassword: payload.oldPassword,
        newPassword: payload.newPassword,
      })
      .then((res: any) => {
        const response = res.data.body;
        // If the response is not successful, reject the promise.
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result:any) => {
        reject(result.response.data);
      })
    });
  }

  /**
   * This function sends a POST request to the server to update the user data.
   * 
   * @param data - The data to be sent to the server.
   * @returns Promise<ApiResponse> - The promise resolves if the user data is updated successfully, otherwise it rejects.
   */
  async updateUser(data: User) : Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.put('/api/user', {
        id: data.id,
        name: data.name,
        email: data.email,
        username: data.username,
        bio: data.bio,
        age: data.age,
        role: data.role,
        prevOrders: data.prevOrders,
        cart: data.cart,
        image: data.image,
        contactDetails: data.contactDetails,
      })
      .then((res: any) => {
        const response = res.data.body;
        // If the response is not successful, reject the promise.
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result:any) => {
        reject(result.response.data);
      })
    });
  }

  /**
   * This function sends a DELETE request to the server to delete a user.
   * 
   * @param id - The id of the user to be deleted.
   * @returns Promise<ApiResponse> - The promise resolves if the user is deleted successfully, otherwise it rejects.
   */
  async deleteUserAccount(id: string) : Promise<ApiResponse> {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.delete('/api/user', { params: { id: id } })
      .then((res: any) => {
        const response = res.data.body;
        // If the response is not successful, reject the promise.
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result:any) => {
        reject(result.response.data);
      })
    });
  }

  /**
   * This function sends a GET request to the server to get the user data from the id.
   * 
   * @param id - The id of the user whose data is to be fetched.
   * @returns Promise<ApiResponse> - The promise resolves if the user data is fetched successfully, otherwise it rejects.
   */
  async getUserFromId(id: string) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.get('/api/user', { params: { id: id } })
      .then((res: any) => {
        const response = res.data.body;
        response.data.id = response.data._id;
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result: any) => {
        reject(result.response.data);
      })
    })
  }
}