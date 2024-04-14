/**
 * @fileoverview This file contains the API route for uploading files.
 * We use the uploadthing library to handle file uploads.
 * We have two file upload modules: userPhotoUploader and catalogueUploader.
 */
import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const auth = async() => await getServerSession();

export const ourFileRouter = {
  // User photo uploader module.
  userPhotoUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await auth();
      const user = session?.user;
      if (!user) throw new Error("Unauthorized");
      return { email: user.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("User photo upload complete for userId:", metadata.email);
      console.log("file url", file.url);
      return { uploadedBy: metadata.email };
    }),
  // Catalogue uploader module.
  // This module allows the user to upload multiple images and videos.
  // This is used when farmers want to upload their product catalogues.
  catalogueUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 }, video: { maxFileSize: "32MB", maxFileCount: 10 } })
    .middleware(async ({ req }) => {
      const session = await auth();
      const user = session?.user;
      if (!user) throw new Error("Unauthorized");
      return { email: user.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Catalogue upload complete for userId:", metadata.email);
      console.log("file url", file.url);
      return { uploadedBy: metadata.email };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;