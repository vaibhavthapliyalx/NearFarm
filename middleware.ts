// This file is middleware that authenticates the user before allowing them to access the pages
// specified inside the matcher array. In this case, the matcher array is set to ["/"] which means
// that the user must be authenticated before they can access the home page. If the user is not
// authenticated, they will be redirected to the login page.

// This is just a workaround for protecting the specific routes,
// ToDo: Find an alternative way to handle this issue.

export {default} from "next-auth/middleware";


export const config = {
    matcher: ["/onboarding", "/profile"]
}