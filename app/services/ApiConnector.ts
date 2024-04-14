/**
 * @fileoverview This file contains the ApiConnector class.
 * This class is used to connect to the Server.
 */

// Importing necessary libraries and modules.
import axios from "axios";
import { getSession, signIn, signOut } from "next-auth/react";
import { ApiResponse, CartItem, ChangePasswordPayload, Order, OrderItem, Product, QueryParams, ResetPasswordPayload, Review, User } from "../../shared/interfaces";
import type { NextApiRequest } from "next";
import { LikeAction, OrderStatus, ProviderType } from "@/shared/constants";
import qs from "qs";

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

  /**
   * This function sends a GET request to the server to get the products by the filter provided.
   * 
   * @param queryParams - The query parameters to be sent to the server.
   * @returns Promise<ApiResponse> - The promise resolves if the products are fetched successfully, otherwise it rejects.
   */
  async getProducts(queryParams: QueryParams) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.get('/api/product', { 
        params: {
          id: queryParams.id,
          name: queryParams.name,
          sortByPriceOrder: queryParams.sortByPriceOrder,
          sortByRatingOrder: queryParams.sortByRatingOrder,
          sortByNearestLocation: queryParams.sortByNearestLocation,
          sortByAvailableFromDate: queryParams.sortByAvailableFromDate,
          tags: queryParams.tags,
          page: queryParams.page,
          limit: queryParams.limit
        },
        paramsSerializer: params => {
          // Serialize 'category' array using 'qs' library
          params.category = qs.stringify({category: queryParams.category}, {arrayFormat: 'brackets'});
          return qs.stringify(params);
        }
      })
      .then((res: any) => {
        const response = res.data.body;
        if (!response.success) {
          reject(response);
        } else {
          const products: Product[] = 
          response.data.map((prod: any) => {
            return {
              id: prod._id,
              name: prod.name,
              description: prod.description,
              salePrice: prod.sale_price,
              marketPrice: prod.market_price,
              quantity: prod.quantity,
              image: prod.image_url,
              sellerId: prod.seller_id,
              availableFrom: prod.available_from,
              listedAt: prod.listed_at,
              collectionAddress: prod.collection_address,
              category: prod.category,
              notes: prod.notes, 
              rating: prod.rating
            }
          });
          response.data = products;
          resolve(response);
        }
      })
      .catch((result: any) => {
        reject(result.response.data);
      })
    })
  }

  /**
   *  This function send a GET request to search for products with the name provided.
   * 
   * @param name - The name of the product to be searched. 
   * @returns Promise<ApiResponse> - The promise resolves if the products are fetched successfully, otherwise it rejects.
   */
  async searchProductsWithName(name: string) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.get('/api/product', { params: { name: name } })
      .then((res: any) => {
        const response = res.data.body;
        if (!response.success) {
          reject(response);
        } else {
          const products: Product[] = 
          response.data.map((prod: any) => {
            return {
              id: prod._id,
              name: prod.name,
              description: prod.description,
              salePrice: prod.sale_price,
              marketPrice: prod.market_price,
              quantity: prod.quantity,
              image: prod.image_url,
              sellerId: prod.seller_id,
              availableFrom: prod.available_from,
              listedAt: prod.listed_at,
              collectionAddress: prod.collection_address,
              category: prod.category,
              notes: prod.notes, 
              rating: prod.rating
            }
          });
          response.data = products;
          resolve(response);
        }
      })
      .catch((result: any) => {
        console.log(result);
        reject(result.response.data);
      })
    })
  }

  /**
   * This function sends a POST request to the server to list a new product.
   * 
   * @param product - The product to be listed.
   * @returns Promise<ApiResponse> - The promise resolves if the product is listed successfully, otherwise it rejects.
   */
  async listProduct(product: Product) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.post('/api/product', {
        name: product.name,
        description: product.description,
        salePrice: product.salePrice,
        marketPrice: product.marketPrice,
        quantity: product.quantity,
        image: product.image,
        sellerId: product.sellerId,
        availableFrom: product.availableFrom,
        collectionAddress: product.collectionAddress,
        category: product.category,
        notes: product.notes
      })
      .then((res: any) => {
        const response = res.data.body;
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
   * This function sends a PUT request to the server to update a product listing.
   * 
   * @param product - The product to be updated.
   * @returns Promise<ApiResponse> - The promise resolves if the product is updated successfully, otherwise it rejects.
   */
  async updateProduct(product: Product) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.put('/api/product', {
        id: product.id,
        name: product.name,
        description: product.description,
        salePrice: product.salePrice,
        marketPrice: product.marketPrice,
        quantity: product.quantity,
        image: product.image,
        sellerId: product.sellerId,
        availableFrom: product.availableFrom,
        collectionAddress: product.collectionAddress,
        category: product.category,
        notes: product.notes
      })
      .then((res: any) => {
        const response = res.data.body;
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result: any) => {
        reject(result.response.data);
      });
    })
  }

  /**
   * This function sends a DELETE request to the server to delete a product listing.
   * 
   * @param id - The id of the product to be deleted.
   * @returns Promise<ApiResponse> - The promise resolves if the product is deleted successfully, otherwise it rejects.
   */
  async deleteProduct(id: string) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.delete('/api/product', { params: { id: id } })
      .then((res: any) => {
        const response = res.data.body;
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result: any) => {
        reject(result.response.data);
      });
    });
  }

  /**
   * This function sends a POST request to the server to add items to the cart.
   * 
   * @param userId - The id of the user.
   * @param productId - The id of the product.
   * @param quantity - The quantity of the product.
   * @returns Promise<ApiResponse> - The promise resolves if the items are added to the cart successfully, otherwise it rejects.
   */
  async addItemToCart(cartItem: CartItem) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.post('/api/cart', {
        userId: cartItem.userId,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        name: cartItem.name,
        price: cartItem.price,
        image: cartItem.image
      })
      .then((res: any) => {
        const response = res.data.body;
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result: any) => {
        reject(result.response.data);
      });
    });
  }

  /**
   * This function sends a DELETE request to the server to remove item from the cart.
   * 
   * @param userId - The id of the user.
   * @param productId - The id of the product.
   * @returns Promise<ApiResponse> - The promise resolves if the items are removed from the cart successfully, otherwise it rejects.
   */
  async removeItemFromCart(userId: string, productId: string) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.delete('/api/cart', { params: { userId: userId, productId: productId } })
      .then((res: any) => {
        const response = res.data.body;
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result: any) => {
        reject(result.response.data);
      });
    });
  }

  /**
   * This function sends a GET request to the server to get the items in the cart.
   * 
   * @param userId - The id of the user.
   * @returns Promise<ApiResponse> - The promise resolves if the items in the cart are fetched successfully, otherwise it rejects.
   */
  async getCartItems(userId: string) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.get('/api/cart', { params: { userId: userId } })
      .then((res: any) => {
        const response = res.data.body;
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result: any) => {
        reject(result.response.data);
      });
    });
  }

  /**
   * This function sends a PUT request to the server to update the cart item.
   * 
   * @param userId - The id of the user.
   * @param productId - The id of the product.
   * @param quantity - The quantity of the product.
   * @returns Promise<ApiResponse> - The promise resolves if the cart item is updated successfully, otherwise it rejects.
   */
  async updateCartItem(userId: string, productId: string, quantity: number) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.put('/api/cart', {
        userId: userId,
        productId: productId,
        quantity: quantity,
      })
      .then((res: any) => {
        const response = res.data.body;
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result: any) => {
        reject(result.response.data);
      });
    });
  }

  /**
   * This function sends a POST request to the server to place an order.
   * 
   * @param userId - The id of the user.
   * @param OrderItems - The item to be ordered.
   * @returns Promise<ApiResponse> - The promise resolves if the order is placed successfully, otherwise it rejects.
   */
  async placeOrder(userId: string, orderItems: OrderItem[]) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.post('/api/order', { 
        userId: userId,
        orderItems: orderItems
      })
      .then((res: any) => {
        const response = res.data.body;
        const order: Order = {
          id: response.data._id,
          userId: response.data.userId,
          items: response.data.items,
          status: response.data.status,
          orderTotal: response.data.orderTotal,
          placedAt: response.data.placedAt,
          updatedAt: response.data.updatedAt
        }
        response.data = order;
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result: any) => {
        reject(result.response.data);
      });
    });
  }

  /**
   * This function sends a GET request to the server to get the orders placed by the user.
   * 
   * @param userId - The id of the user.
   * @returns Promise<ApiResponse> - The promise resolves if the orders are fetched successfully, otherwise it rejects.
   */
  async getPrevOrders(userId: string) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.get('/api/order', { params: { userId: userId } })
      .then((res: any) => {
        const response = res.data.body;
        const orders: Order[] = response.data.map((order: any) => {
          return {
            id: order._id,
            userId: order.userId,
            items: order.items,
            status: order.status,
            orderTotal: order.orderTotal,
            placedAt: order.placedAt,
            updatedAt: order.updatedAt
          }
        });
        response.data = orders;
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result: any) => {
        reject(result.response.data);
      });
    });
  }

  /**
   * This function sends a DELETE request to the server to cancel an order.
   * 
   * @param orderId - The id of the order to be cancelled.
   * @returns Promise<ApiResponse> - The promise resolves if the order is cancelled successfully, otherwise it rejects.
   */
  async cancelOrder(orderId: string) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.delete('/api/order', { params: { orderId: orderId } })
      .then((res: any) => {
        const response = res.data.body;
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result: any) => {
        reject(result.response.data);
      });
    });
  }

  /**
   * This function sends a PUT request to the server to update the status of an order.
   * 
   * @param orderId - The id of the order.
   * @param status - The status of the order.
   * @returns Promise<ApiResponse> - The promise resolves if the order status is updated successfully, otherwise it rejects.
   */
  async updateOrder(orderId: string, status: OrderStatus) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.put('/api/order', { orderId: orderId, status: status })
      .then((res: any) => {
        const response = res.data.body;
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result: any) => {
        reject(result.response.data);
      });
    });
  }

  /**
   * This function sends a GET request to the server to get the orders by the id.
   * 
   * @param orderId - The id of the order.
   * @returns Promise<ApiResponse> - The promise resolves if the orders are fetched successfully, otherwise it rejects.
   */
  async getOrderByID(orderId: string) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.get('/api/order', { params: { orderId: orderId } })
      .then((res: any) => {
        const response = res.data.body;
        const order: Order = {
          id: response.data._id,
          userId: response.data.userId,
          items: response.data.items,
          status: response.data.status,
          orderTotal: response.data.orderTotal,
          placedAt: response.data.placedAt,
          updatedAt: response.data.updatedAt
        }
        response.data = order;
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result: any) => {
        reject(result.response.data);
      });
    });
  }

  /**
   * This function sends a POST request to the server to add a review.
   * 
   * @param review - The review to be added.
   * @returns Promise<ApiResponse> - The promise resolves if the review is added successfully, otherwise it rejects.
   */
  async getReviews({productId, userId}: {productId?: string, userId?: string}) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.get('/api/review', { params: { productId: productId, userId: userId } })
      .then((res: any) => {
        const response = res.data.body;
        const reviews: Review[] = response.data.map((review: any) => {
          return {
            id: review._id,
            productId: review.productId,
            productName: review.productName,
            userId: review.userId,
            userName: review.userName,
            rating: review.rating,
            review: review.review,
            edited: review.edited,
            reviewedAt: review.reviewedAt,
            likes: review.likes
          }
        });
        response.data = reviews;
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result: any) => {
        reject(result.response.data);
      });
    });
  }

  /**
   * This function sends a POST request to the server to add a review.
   * 
   * @param review - The review to be added.
   * @returns Promise<ApiResponse> - The promise resolves if the review is added successfully, otherwise it rejects.
   */
  async addReview(review: Review) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.post('/api/review', {
        productId: review.productId,
        productName: review.productName,
        userId: review.userId,
        userName: review.userName,
        rating: review.rating,
        review: review.review,
        likes: review.likes
      })
      .then((res: any) => {
        const response = res.data.body;
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result: any) => {
        reject(result.response.data);
      });
    });
  }

  /**
   * This function sends a POST request to the server to add a review.
   * 
   * @param review - The review to be added.
   * @returns Promise<ApiResponse> - The promise resolves if the review is added successfully, otherwise it rejects.
   */
  async updateReview(review: Review) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.put('/api/review', {
        id: review.id,
        rating: review.rating,
        review: review.review
      })
      .then((res: any) => {
        const response = res.data.body;
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result: any) => {
        reject(result.response.data);
      });
    });
  }

  /**
   * This function sends a POST request to the server to add a review.
   * 
   * @param review - The review to be added.
   * @returns Promise<ApiResponse> - The promise resolves if the review is added successfully, otherwise it rejects.
   */
  async deleteReview(reviewId: string) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.delete('/api/review', { params: { reviewId: reviewId } })
      .then((res: any) => {
        const response = res.data.body;
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result: any) => {
        reject(result.response.data);
      });
    });
  }

  /**
   * This function sends a POST request to the server to like/unlike a review
   * based on the action provided.
   * 
   * @param reviewId - The id of the review.
   * @param userId - The id of the user.
   * @returns Promise<ApiResponse> - The promise resolves if the review is liked successfully, otherwise it rejects.
   */
  async updateReviewLike(reviewId: string, userId: string, action: LikeAction) {
    return new Promise<ApiResponse>((resolve, reject) => {
      axios.post('/api/review/like', {
        reviewId: reviewId,
        userId: userId,
        action: action
      })
      .then((res: any) => {
        const response = res.data.body;
        if (!response.success) {
          reject(response);
        } else {
          resolve(response);
        }
      })
      .catch((result: any) => {
        reject(result.response.data);
      });
    });
  }
}