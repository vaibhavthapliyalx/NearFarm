/**
 * @fileoverview  This file contains the constants used in the application.
 */

/**
 * @enum The navigation links for the navbar.
 */
export const NavbarLinks = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/search.svg",
    route: "/products",
    label: "Products",
  },
  {
    imgURL: "/assets/icons/heart.svg",
    route: "/activity",
    label: "Activity",
  },
  {
    imgURL: "/assets/icons/cart.svg",
    route: "/cart",
    label: "Cart",
  },
  {
    imgURL: "/assets/icons/user.svg",
    route: "/profile",
    label: "Profile",
  },
];

/**
 * @enum The navigation links for profile page tabs.
 * 
 * @property {string} REVIEWS - The reviews tab.
 * @property {string} Orders - The orders tab.
 */
export enum ProfilePageTabType {
  REVIEWS = "reviews",
  ORDERS = "orders"
}

/**
 * @enum The navigation links for product page tabs.
 * 
 * @property {string} REVIEWS - The reviews tab.
 * @property {string} SELLER_INFO - The seller info tab.
 */
export enum ProductDetailsPageTabType {
  REVIEWS = "reviews",
  SELLER_INFO = "seller info"
}

/**
 * @const The navigation links for profile page tabs.
 */
export const profilePageTabs = [
  { value: ProfilePageTabType.REVIEWS, label: "My Reviews" },
  { value: ProfilePageTabType.ORDERS, label: "My Orders" },
  // { value: "tagged", label: "Tagged", icon: "/assets/tag.svg" },
];

/**
 * @enum The navigation links for product page tabs.
 */
export const productPageTabs = [
  { value: ProductDetailsPageTabType.REVIEWS, label: "Reviews" },
  { value: ProductDetailsPageTabType.SELLER_INFO, label: "Seller Information"},
];

/**
 * @type The type of Signup Error.
 * 
 * @property {string} name - The name of the user.
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 */
export type SignupErrorType = {
    name?: string;
    email?: string;
    password?: string;
}

/**
 * @enum The types of toast messages used in the application.
 * 
 * @property {string} DEFAULT - The default toast message.
 * @property {string} DESTRUCTIVE - The destructive toast message.
 */
export enum ToastType {
  DEFAULT = "default",
  DESTRUCTIVE = "destructive",
}

/**
 * @enum The path of the Google logo.
 * 
 * @property {string} DEFAULT - The default Google logo.
 */
export enum GoogleLogo {
 DEFAULT = "/assets/logos/providers/google-icon.svg"
}

/**
 * @enum The type of navigation item.
 * This is to ensure that the navigation item is rendered correctly on the UI 
 * based on the device type.
 * 
 * @property {string} MOBILE - The mobile navigation item.
 * @property {string} DESKTOP - The desktop navigation item.
 */
export enum NavItemType {
  MOBILE,
  DESKTOP
}

/**
 * @enum The type of provider used for authentication.
 * 
 * @property {string} GOOGLE - The Google provider.
 * @property {string} GITHUB - The Github provider.
 * @property {string} CREDENTIALS - The credentials provider (email and password).
 */
export enum ProviderType {
  GOOGLE = "google",
  GITHUB = "github",
  CREDENTIALS = "credentials"
}

/**
 * @enum The type of user role.
 * 
 * @property {string} CONSUMER - The consumer role.
 * @property {string} FARMER - The farmer role.
 */
export enum UserRole {
  CONSUMER = "consumer",
  FARMER = "farmer",
}

/**
 * @enum The authentication status of the user.
 * 
 * @property {string} AUTHENTICATED - The user is authenticated.
 * @property {string} UNAUTHENTICATED - The user is unauthenticated.
 * @property {string} LOADING - The user is loading.
 */
export enum AuthenticationStatus {
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
  LOADING = "loading"
}

/**
 * @enum Categories of products.
 * 
 * @property {string} ALL - All categories.
 * @property {string} ORGANIC_FRUITS_VEGETABLES - The organic fruits & vegetables category.
 * @property {string} CUTS_SPROUTS - The cuts & sprouts category.
 * @property {string} FLOWER_BOUQUETS_BUNCHES - The flower bouquets, bunches category.
 * @property {string} FRESH_VEGETABLES - The fresh vegetables category.
 * @property {string} EXOTIC_FRUITS_VEGGIES - The exotic fruits & veggies category.
 * @property {string} HERBS_SEASONINGS - The herbs & seasonings category.
 * @property {string} FRESH_FRUITS - The fresh fruits category.
 * @property {string} OTHERS - The others category.
 */
export enum ProductCategory {
  ALL= "All",
  ORGANIC_FRUITS_VEGETABLES = "Organic Fruits & Vegetables",
  CUTS_SPROUTS = "Cuts & Sprouts",
  FLOWER_BOUQUETS_BUNCHES = "Flower Bouquets, Bunches",
  FRESH_VEGETABLES = "Fresh Vegetables",
  EXOTIC_FRUITS_VEGGIES = "Exotic Fruits & Veggies",
  HERBS_SEASONINGS = "Herbs & Seasonings",
  FRESH_FRUITS = "Fresh Fruits",
  OTHERS = "Others",
}

/**
 * @enum The method of purchase of the product.
 * 
 * @property {string} COLLECT - Consumers collect the product.
 * @property {string} DELIVER - Consumers have the product delivered to them.
 */
export enum OrderMethod {
  COLLECT = "Collect",
  DELIVER = "Deliver",
}

/**
 * @enum The status of the order.
 * 
 * @property {string} PENDING - The order is pending.
 * @property {string} CONFIRMED - The order is confirmed.
 * @property {string} CANCELLED - The order is cancelled.
 * @property {string} DELIVERED - The order is delivered.
 * @property {string} RETURNED - The order is returned.
 * @property {string} REFUNDED - The order is refunded.
 * @property {string} COMPLETED - The order is completed.
 */
export enum OrderStatus {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  CANCELLED = "Cancelled",
  DELIVERED = "Delivered",
  RETURNED = "Returned",
  REFUNDED = "Refunded",
  COMPLETED = "Completed",
}

/**
 * @enum The permissions of the user.
 * 
 * @property {string} LIST_PRODUCTS - The permission to list products.
 * @property {string} EDIT_LISTINGS - The permission to edit listings.
 * @property {string} DELETE_LISTINGS - The permission to delete listings.
 * @property {string} VIEW_ORDERS - The permission to view orders.
 * @property {string} EDIT_ORDERS - The permission to edit orders.
 * @property {string} DELETE_ORDERS - The permission to delete orders.
 */
export const Permissions = {
  LIST_PRODUCTS: "listProducts",
  EDIT_LISTINGS: "editListings",
  DELETE_LISTINGS: "deleteListings",
  VIEW_ORDERS: "viewOrders",
  EDIT_ORDERS: "editOrders",
  DELETE_ORDERS: "deleteOrders",
  MANAGE_USERS: "manageUsers",
}

/**
 * @enum The sort order of the products.
 * 
 * @property {string} ASCENDING - The products are sorted in ascending order.
 * @property {string} DESCENDING - The products are sorted in descending order.
 */
export enum SortOrder {
  ASCENDING = "asc",
  DESCENDING = "desc",
}

/**
 * @enum The sort by filter of the products.
 * 
 * @property {string} PRICE_LOW_TO_HIGH - The products are sorted by price in ascending order.
 * @property {string} PRICE_HIGH_TO_LOW - The products are sorted by price in descending order.
 * @property {string} NEWEST - The products are sorted by newest.
 * @property {string} OLDEST - The products are sorted by oldest.
 * @property {string} RATING_LOW_TO_HIGH - The products are sorted by rating in ascending order.
 * @property {string} RATING_HIGH_TO_LOW - The products are sorted by rating in descending order.
 * @property {string} NONE - The products are not sorted.
 */
export enum SortByFilter {
  PRICE_LOW_TO_HIGH = "Price: Low to High",
  PRICE_HIGH_TO_LOW = "Price: High to Low",
  NEWEST = "Newest",
  OLDEST = "Oldest",
  RATING_LOW_TO_HIGH = "Rating: Low to High",
  RATING_HIGH_TO_LOW = "Rating: High to Low",
  NONE = "None",
}

/**
 * @enum The type of like action.
 * 
 * @property {string} LIKE - The user likes the product.
 * @property {string} UNLIKE - The user dislikes the product.
 */
export enum LikeAction {
  LIKE,
  UNLIKE
}
// Pseudo-code authorization middleware
// function checkPermission(user: User, permission: string): boolean {
//   // Get the user's role and check if it has the required permission
//   switch (user.role) {
//     case UserRole.FARMER:
//       return permission === Permissions.ADD_PRODUCT || permission === Permissions.EDIT_PRODUCT;
//     case UserRole.ADMIN:
//       return permission === Permissions.VIEW_ORDERS;
//     case UserRole.CUSTOMER:
//       return permission === Permissions.PLACE_ORDER;
//     default:
//       return false; // Unknown role
//   }
// }

// // Example usage
// const loggedInUser: User = /* Fetch user from authentication */;
// const canAddProduct = checkPermission(loggedInUser, Permissions.ADD_PRODUCT);
// console.log(`Can add product? ${canAddProduct}`); // Output: Can add product? true
