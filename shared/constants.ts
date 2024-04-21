/**
 * @fileoverview  This file contains the constants used in the application.
 */

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
 * @enum The navigation links for the navbar.
 */
export const NavbarLinks = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
    role: [UserRole.CONSUMER, UserRole.FARMER],
  },
  {
    imgURL: "/assets/icons/search.svg",
    route: "/products",
    label: "Products",
    role: [UserRole.CONSUMER, UserRole.FARMER],
  },
  {
    imgURL: "/assets/icons/dashboard-dark.svg",
    route: "/dashboard",
    label: "Dashboard",
    role: [UserRole.FARMER],
  },
  {
    imgURL: "/assets/icons/cart.svg",
    route: "/cart",
    label: "Cart",
    role: [UserRole.CONSUMER, UserRole.FARMER],
  },
  {
    imgURL: "/assets/icons/user.svg",
    route: "/profile",
    label: "Profile",
    role: [UserRole.CONSUMER, UserRole.FARMER],
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
  { value: ProfilePageTabType.REVIEWS, label: "Reviews I've Written" },
  { value: ProfilePageTabType.ORDERS, label: "Orders I've Placed" },
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
 * @property {string} IN_TRANSIT - The order is in transit.
 * @property {string} COMPLETED - The order is completed.
 */
export enum OrderStatus {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  CANCELLED = "Cancelled",
  DELIVERED = "Delivered",
  RETURNED = "Returned",
  REFUNDED = "Refunded",
  IN_TRANSIT = "In Transit",
  COMPLETED = "Completed",
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

/**
 * @enum The type of map.
 * 
 * @property {string} SELLER_LOCATION - The seller location map.
 * @property {string} CUSTOMER_TRAFFIC - The customer traffic map.
 */
export enum MapType {
  NEARBY_SELLERS = "farmer",
  NEARBY_CUSTOMERS = "customer"
}

