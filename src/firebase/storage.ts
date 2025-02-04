// src/lib/firebase/storage.ts

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./clientApp"; // Firebase Storage instance
import {
  updateProductImageReference,
  updateUserPhotoReference,
} from "./firestore";

/**
 * updateUserPhoto:
 *  - Uploads the given image file to Firebase Storage under a user-specific path.
 *  - Updates the user document in Firestore with the new image URL.
 *
 * @param userId - The ID of the user whose photo is being updated.
 * @param image - The image file to upload.
 * @returns A Promise that resolves with the public download URL of the uploaded image.
 */
export async function updateUserPhoto(
  userId: string,
  image: File
): Promise<string> {
  try {
    // Upload the image and get its public URL.
    const photoUrl = await uploadUserPhoto(userId, image);
    // Update the Firestore document with the new photo URL.
    await updateUserPhotoReference(userId, photoUrl);
    return photoUrl;
  } catch (error) {
    console.error("Error updating user photo:", error);
    throw error;
  }
}

/**
 * uploadUserPhoto:
 *  - Uploads an image file to Firebase Storage at a path based on the user ID.
 *  - Monitors the upload progress and returns the download URL upon completion.
 *
 * @param userId - The user ID used to create the storage path.
 * @param image - The image file to upload.
 * @returns A Promise that resolves with the download URL of the uploaded image.
 */
async function uploadUserPhoto(userId: string, image: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    // Define a storage reference for the user's photo.
    // For example: "users/{userId}/{imageName}"
    const storageRef = ref(storage, `users/${userId}/${image.name}`);

    // Start the upload task.
    const uploadTask = uploadBytesResumable(storageRef, image);

    // Monitor the upload process.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optional: Calculate and log upload progress if desired.
        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
      },
      (error: any) => {
        console.error("Error during image upload:", error);
        reject(error);
      },
      async () => {
        try {
          // On successful upload, retrieve the download URL.
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (error) {
          console.error("Error getting download URL:", error);
          reject(error);
        }
      }
    );
  });
}

/**
 * updateProductImage:
 *  - Uploads the given image file to Firebase Storage under a product-specific path.
 *  - Updates the product document in Firestore with the new image URL.
 *
 * @param productId - The ID of the product whose image is being updated.
 * @param image - The image file to upload.
 * @returns A Promise that resolves with the public download URL of the uploaded image.
 */
export async function updateProductImage(
  productId: string,
  image: File
): Promise<string> {
  try {
    // Upload the image and get its public URL.
    const imageUrl = await uploadProductImage(productId, image);

    // Update the Firestore document with the new image URL.
    // This function should update the relevant field (e.g., "photoURL") in your product document.
    await updateProductImageReference(productId, imageUrl);

    return imageUrl;
  } catch (error) {
    console.error("Error updating product image:", error);
    throw error;
  }
}

/**
 * uploadProductImage:
 *  - Uploads an image file to Firebase Storage at a path based on the product ID.
 *  - Monitors the upload progress and returns the download URL upon completion.
 *
 * @param productId - The product ID used to create the storage path.
 * @param image - The image file to upload.
 * @returns A Promise that resolves with the download URL of the uploaded image.
 */
async function uploadProductImage(
  productId: string,
  image: File
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    // Define a storage reference for the product image.
    // For example: "products/{productId}/{imageName}"
    const storageRef = ref(storage, `products/${productId}/${image.name}`);

    // Start the upload task.
    const uploadTask = uploadBytesResumable(storageRef, image);

    // Monitor the upload process.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optional: Calculate and log upload progress if desired.
        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
      },
      (error: any) => {
        console.error("Error during image upload:", error);
        reject(error);
      },
      async () => {
        try {
          // On successful upload, retrieve the download URL.
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (error) {
          console.error("Error getting download URL:", error);
          reject(error);
        }
      }
    );
  });
}
