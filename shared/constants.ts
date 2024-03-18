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
    route: "/search",
    label: "Search",
  },
  {
    imgURL: "/assets/icons/heart.svg",
    route: "/activity",
    label: "Activity",
  },
  {
    imgURL: "/assets/icons/user.svg",
    route: "/profile",
    label: "Profile",
  },
];

/**
 * @enum The navigation links for the footer.
 */
export const profilePageTabs = [
  { value: "reviews", label: "Reviews", icon: "/assets/reply.svg" },
  { value: "replies", label: "Replies", icon: "/assets/members.svg" },
  { value: "tagged", label: "Tagged", icon: "/assets/tag.svg" },
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