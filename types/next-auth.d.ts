// This file has been created to handle the typescript errors that were being thrown by the next-auth package.
// By default, the next auth session object does not have a id property for user.
// This way we inject the id property in the session object.
// Please note this is only a temporary workaround,
// and will be removed once we have a better solution.

import { UserRole } from "@/shared/constants";
import { Session, User } from "next-auth";
import { DefaultSession } from "next-auth/_next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
    } & DefaultSession["user"],
    // Role has been added for role based access control (RBAC) in the application.
    role: UserRole
  }
}

