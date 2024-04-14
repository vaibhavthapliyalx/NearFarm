/**
 * @fileoverview This file contains all the common interfaces used in the application.
 */

import { OrderStatus, ProductCategory, SortOrder, UserRole } from "./constants";

/**
 * @interface Product This interface defines the structure of the product object.
 * 
 * @property {number} id - The id of the product.
 * @property {string} name - The name of the product.
 * @property {string} description - The description of the product.
 * @property {number} salePrice - The sale price of the product.
 * @property {number} marketPrice - The market price of the product.
 * @property {number} quantity - The quantity of the product.
 * @property {string} image - The image of the product.
 * @property {string} sellerId - The id of the seller.
 * @property {string} availableFrom - The date from which the product is available.
 * @property {string} listedAt - The date/time on which the product was listed.
 * @property {string} collectionAddress - The collection address of the product.
 * @property {string} category - The category of the product.
 * @property {string} notes - The notes of the product.
 * @property {number} rating - The rating of the product.
  * @property {Array<Review>} reviews - The reviews of the product. 
*/
export interface Product {
  id?: string;
  name: string;
  description: string;
  salePrice: number;
  marketPrice: number;
  quantity: number;
  image: string;
  catalogue?: string[];
  sellerId: string;
  availableFrom: string;
  listedAt: string;
  collectionAddress: string;
  category: ProductCategory;
  notes: string;
  rating: number;
}


/**
 * @interface Order This interface defines the structure of the order object.
 * 
 * @property {string} id - The id of the order.
 * @property {number} userId - The id of the user.
 * @property {Array<OrderItem>} items - The items in the order.
 * @property {OrderStatus} status - The status of the order.
 * @property {number} orderTotal - The total amount of the order.
 * @property {string} placedAt - The date on which the order was placed.
 * @property {string} updatedAt - The date on which the order was updated.
 */
export interface Order {
  id: string;
  userId: number;
  items: OrderItem[],
  status: OrderStatus,
  orderTotal: number;
  placedAt: string;
  updatedAt: string;
}

/**
 * @interface This interface defines the structure of the order item.
 * 
 * @property {string} productId - The id of the product.
 * @property {string} productName - The name of the product.
 * @property {number} quantity - The quantity of the product.
 * @property {number} orderPrice - The price of the product.
 */
export interface OrderItem {
  productImage: string;
  productName: string;
  quantity: number;
  orderPrice: number;
}

/**
 * @interface This interface defines the structure of the cart item.
 * 
 * @property {string} id - The id of the cart item.
 * @property {string} productId - The id of the product.
 * @property {string} userId - The id of the user.
 * @property {string} name - The name of the product.
 * @property {number} quantity - The quantity of the product.
 * @property {number} price - The price of the product.
 * @property {string} image - The image of the product.
 */
export interface CartItem {
  productId: string;
  userId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
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
 * @property {string} username - The username of the user.
 * @property {string} bio - The bio of the user.
 * @property {string} password - The password of the user.
 * @property {boolean} isOnBoarded - The onboarding status of the user.
 * @property {number} age - The age of the user.
 * @property {UserRole} role - The role of the user.
 * @property {Array<string>} prevOrders - The previous orders of the user.
 * @property {Array<CartItem>} cart - The cart of the user. This is an array of product ids.
 * @property {string} image - The image of the user.
 * @property {string} joinDate - The date on which the user joined.
 * @property {string} resetPasswordToken - The reset password token of the user.
 * @property {Array<string>} documents - The documents of the user.
 * @property {ContactDetails} contactDetails - The contact details of the user.
 * @property {boolean} isVerified - The verification status of the user.
 * @property {Array<string>} likedReviews - The array of review ids liked by the user.
 * @property {any} roleSpecificData - The role specific data of the user.
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
  cart: CartItem[];
  image: string;
  joinDate: string;
  resetPasswordToken: string;
  documents: string[];
  contactDetails: ContactDetails;
  isVerified: boolean;
  likedReviews?: string[];
  roleSpecificData?: any;
}

/**
 * @interface This interface defines the structure of the review object.
 * 
 * @property {number} id - The id of the review.
 * @property {number} productId - The id of the product.
 * @property {string} productName - The name of the product.
 * @property {number} userId - The id of the user.
 * @property {string} userName - The name of the user.
 * @property {number} rating - The rating of the review.
 * @property {string} review - The review of the product.
 * @property {string} reviewedAt - The date on which the review was posted.
 * @property {number} likes - The number of likes on the review.
 * @property {boolean} liked - The liked status of the review.
 * @property {boolean} edited - The edited status of the review.
 */
export interface Review {
  id?: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  rating: number;
  review: string;
  reviewedAt?: string;
  likes?: number;
  liked?: boolean;
  edited?: boolean;
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
 * @property {number} totalPages - The total number of pages used in pagination.
 */
export interface ApiResponse {
  data?: any;
  success: boolean;
  message: string | [];
  error?: any;
  totalPages?: number; 
}

/**
 * @interface This interface defines the structure of the query parameters.
 * 
 * @property {string} id - The id of the product.
 * @property {string} name - The name of the product.
 * @property {Array<string>} category - The category of the product.
 * @property {string} sortByPriceOrder - The order in which the products are sorted by price.
 * @property {string} sortByRatingOrder - The order in which the products are sorted by rating.
 * @property {string} sortByNearestLocation - The order in which the products are sorted by nearest location provided.
 * @property {string} sortByAvailableFromDate - The date after which the products are sorted by available from date.
 * @property {string} page - The page number.
 * @property {string} limit - The limit of the products.
 */
export interface QueryParams {
  id?: string;
  name?: string;
  category?: ProductCategory[] ;
  sortByPriceOrder?: SortOrder;
  sortByRatingOrder?: SortOrder;
  sortByNearestLocation?: SortOrder;
  sortByAvailableFromDate?: SortOrder;
  tags?: string;
  page?: number;
  limit?: number;
}
