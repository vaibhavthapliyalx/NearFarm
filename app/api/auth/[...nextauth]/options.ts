/**
 * @fileoverview This file contains the NextAuth options.
 * Please note that some parts of this code are directly copied from the NextAuth documentation.
 * Please refer to the NextAuth documentation for more information.
 */
import type { NextAuthOptions } from 'next-auth'
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { connectDB } from '@/lib/database'
import User from '@/lib/models/user.model'

export const options: NextAuthOptions = {
    pages: {
        signIn: '/login',
      },
    providers: [
        // OAuth authentication providers...
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string
        }),
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                username: { 
                    label: "Username", 
                    type: "text", 
                    placeholder: "Your username goes here.."
                },
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "Your email goes here.."
                },
                password: { 
                    label: "Password", 
                    type: "password",
                    placeholder: "Your password goes here.."
                }
            },
            async authorize(credentials, req) {
                //
                await connectDB();
                const user = await User.findOne({ email: credentials?.email });


                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        isOnBoarded: user.isOnBoarded,
                      }
                } else {
                    // If you return null or false then the credentials will be rejected
                    return null
                    // You can also Reject this callback with an Error or with a URL:
                    // throw new Error('error message') // Redirect to error page
                    // throw '/path/to/redirect'        // Redirect to a URL
                }
            },
        }),
        // GoogleProvider 
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
          if (user) {
            token.id = user.id;
            token.name = user.name;  // Add user name to token
            token.image = user.image;  // Add user image to token
          }
          return token;
        },
        session: async ({ session, token }) => {
            if (session.user) {
                session.user.id = token.id;
                session.user.name = token.name;  // Add user name to session
                session.user.image = token.image;  // Add user image to session
            }
          return session;
        },      
        signIn: async ({ user, account, profile }) => {
            try {
                await connectDB();
                const findUser = await User.findOne({ email: user.email });

                if (!findUser) {
                    await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        joinDate: new Date().toISOString(),
                        isOnBoarded: false
                    });
                    return true;
                }
                return true;
            } catch (error) {
                return false;
            }
            
        },
      },
}
    