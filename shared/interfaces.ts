/**
 * @fileoverview This file contains all the common interfaces used in the application.
 */

import { OrderMethod, OrderStatus, ProductCategory, UserRole } from "./constants";

/**
 * @interface Product This interface defines the structure of the product object.
 * 
 * @property {number} id - The id of the product.
 * @property {string} name - The name of the product.
 * @property {string} description - The description of the product.
 * @property {number} price - The price of the product.
 * @property {number} quantity - The quantity of the product.
 * @property {string} image - The image of the product.
 * @property {string} sellerId - The id of the seller.
 * @property {string} availableFrom - The date from which the product is available.
 * @property {string} listedAt - The date/time on which the product was listed.
 * @property {string} collectionAddress - The collection address of the product.
 * @property {string} category - The category of the product.
 * @property {string} notes - The notes of the product.
 */
export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  sellerId: string;
  availableFrom: string;
  listedAt: string; 
  collectionAddress: string;
  category: ProductCategory;
  notes: string;
}


/**
 * @interface Order This interface defines the structure of the order object.
 * 
 * @property {number} id - The id of the order.
 * @property {number} customerId - The id of the customer who placed the order.
 * @property {Array<{productId: number, quantity: number}>} products - The products in the order.
 * @property {string} orderDate - The date on which the order was placed.
 * @property {number} totalPrice - The total price of the order.
 * @property {string} deliveryStatus - The delivery status of the order.
 * @property {string | OrderStatus} orderStatus - The order status of the order.
 */
export interface Order {
  id: number;
  consumerId: number;
  products: OrderItem[],
  orderDate: string;
  totalPrice: number;
  orderMethod: OrderMethod;
  orderStatus: OrderStatus;
}

/**
 * @interface This interface defines the structure of the order item.
 * 
 * @property {number} productId - The id of the product.
 * @property {number} quantity - The quantity of the product.
 */
export interface OrderItem {
  productId: number;
  quantity: number;
}



/**
 * @interface This interface defines the structure of the contact details object.
 * 
 * @property {string} email - The email of the customer.
 * @property {string} phone - The phone number of the customer.
 * @property {string} address - The address of the customer.
 */
export interface ContactDetails {
  email: string;
  phone?: string;
  address: string;
}

/**
 * @interface This interface defines the structure of the user object.
 * 
 * @property {number} id - The id of the user.
 * @property {string} name - The name of the user.
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 * @property {string} joinDate - The date on which the user joined.
 */
export interface User {
  id?: string;
  name: string;
  email: string;
  username: string;
  bio: string;
  password?: string;
  isOnBoarded: boolean;
  age: number;
  role: UserRole;
  prevOrders: string[];
  cart: string[];
  image: string;
  joinDate: string;
  resetPasswordToken: string;
  documents: string[];
  contactDetails: ContactDetails;
  isVerified: boolean;
}

/**
 * @interface This interface defines the structure of the forgot password payload.
 * 
 * @property {string} email - The email of the user.
 */
export interface ForgotPasswordPayload {
  email: string;
}

/**
 * @interface This interface defines the structure of the reset password payload.
 * 
 * @property {string} email - The email of the user.
 * @property {string} password - The new password of the user.
 * @property {string} confirmPassword - The new password of the user.
 * @property {string} signature - The signature of the user.
 */
export interface ResetPasswordPayload {
  email: string;
  password: string;
  confirmPassword: string;
  signature: string; 
}

/**
 * @interface This interface defines the structure of the login payload.
 * 
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 */
export interface ChangePasswordPayload {
  id: string;
  oldPassword: string;
  newPassword: string;
}


/**
 * @interface This interface defines the structure of response from the server.
 * 
 * @property {any} data - The data from the server.
 * @property {boolean} success - The success status of the response.
 * @property {string | Array<string>} message - The message from the server.
 * @property {any} error - The error from the server.
 */
export interface ApiResponse {
  data?: any;
  success: boolean;
  message: string | [];
  error?: any; 
}


  
