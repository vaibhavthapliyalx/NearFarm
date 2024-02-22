/**
 * @File constants.ts
 * @description
 * This file contains the constants used in the application.
 */

/**
 * @enum
 * The navigation links for the navbar.
 */
export const NAVBAR_LINKS = [
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
 * @enum
 * The type of Signup Error.
 */
export type SignupErrorType = {
    name?: string;
    email?: string;
    password?: string;
}

/**
 * @enum
 * The types of toast messages used in the application.
 */
export enum ToastType {
  DEFAULT = "default",
  DESTRUCTIVE = "destructive",
}

/**
 * @enum
 * Image URIs for the social media logos.
 */
export enum GithubLogoVariant {
  BLACK = "/assets/logos/providers/github-icon-black.svg",
  WHITE = "/assets/logos/providers/github-icon-white.svg"
}

export enum GoogleLogo {
 DEFAULT = "/assets/logos/providers/google-icon.svg"
}

/**
 * @enum
 * The type of navigation item.
 * This is to ensure that the navigation item is rendered correctly on the UI 
 * based on the device type.
 */
export enum NAV_ITEM_TYPE {
  MOBILE,
  DESKTOP
}

export enum PROVIDER_TYPE {
  GOOGLE = "google",
  GITHUB = "github",
  CREDENTIALS = "credentials"
}