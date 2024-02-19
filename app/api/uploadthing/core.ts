import ApiConnector from "@/app/services/ApiConnector";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Gets the instance of ApiConnector class that is used to connect to the backend.
const apiConnectorInstance = ApiConnector.getInstance();

const auth = async(req: any) => await apiConnectorInstance.getCurrentUserFromSession();

export const ourFileRouter = {
//   imageUploader: f({ image: { maxFileSize: "4MB" } })
//     .middleware(async ({ req }) => {
//       if (!user) throw new Error("Unauthorized");
//       return { userId: user.id };
//     })
//     .onUploadComplete(async ({ metadata, file }) => {
//       console.log("Upload complete for userId:", metadata.userId);
//       console.log("file url", file.url);
//       return { uploadedBy: metadata.userId };
//     }),
  userPhotoUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("User photo upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
  catalogueUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 }, video: { maxFileSize: "32MB", maxFileCount: 10 } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Catalogue upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;