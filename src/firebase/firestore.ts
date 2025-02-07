// src/lib/firebase/firestore.ts

import {
  collection,
  query,
  orderBy,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  Timestamp,
  runTransaction,
  where,
  addDoc,
  onSnapshot,
  arrayUnion,
  DocumentReference,
  QuerySnapshot,
} from "firebase/firestore";
import { firestore as db } from "./clientApp";


interface AppUserModel {
  uid:string
  name: string;
  phone: string;
  photoURL: string;
}

interface Review {
  reviewId: string;
  authorUserId: string;
  isGood: boolean;
  productId: string;
  text: string;
  createdAt: any; 
}

// -----------------------------
// USERS COLLECTION FUNCTIONS
// -----------------------------

/**
 * Add a new user to the "users" collection.
 * @param userData - Object containing name, phone, photoURL, userType, etc.
 * @returns The reference to the newly added user document.
 */
export async function addUser(
  userData: Record<string, any>
): Promise<DocumentReference> {
  try {
    const userRef = await addDoc(collection(db, "appUsers"), {
      ...userData,
      createdAt: Timestamp.now(),
    });
    return userRef;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}

/**
 * Retrieve a user by their document ID.
 * @param userId - The ID of the user.
 * @returns The user data (with id) or null if not found.
 */
export async function getUserById(
  userId: string
): Promise<Record<string, any> | null> {
  if (!userId) throw new Error("Invalid userId");
  const userDocRef = doc(db, "appUsers", userId);
  console.log("userDocRef" ,userDocRef);
  const docSnap = await getDoc(userDocRef);
  console.log(docSnap.id);
  console.log("userDocSnap",docSnap.data());
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

/**
 * Update an existing user document.
 * @param userId - The ID of the user.
 * @param updateData - An object with the fields to update.
 */
export async function updateUser(
  userId: string,
  updateData: Record<string, any>
): Promise<void> {
  if (!userId) throw new Error("Invalid userId");
  const userDocRef = doc(db, "users", userId);
  await updateDoc(userDocRef, updateData);
}

/**
 * updateUserPhotoReference:
 *   Updates the 'photoURL' field of a user document with the provided image URL.
 *
 * @param userId - The ID of the user.
 * @param photoUrl - The new image URL to set.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateUserPhotoReference(
  userId: string,
  photoUrl: string
): Promise<void> {
  if (!userId) throw new Error("Invalid userId");
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { photoURL: photoUrl });
}

// -----------------------------
// PRODUCTS COLLECTION FUNCTIONS
// -----------------------------

/**
 * Add a new product to the "products" collection.
 * @param productData - Object containing product details.
 * @returns The reference to the newly added product document.
 */
export async function addProduct(
  productData: Record<string, any>
): Promise<DocumentReference> {
  try {
    const productRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: Timestamp.now(),
    });
    return productRef;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
}

/**
 * Retrieve all products ordered by creation date (newest first).
 * @returns An array of product objects.
 */
export async function getProducts(): Promise<Array<Record<string, any>>> {
  try {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const querySnapshot: QuerySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ? doc.data().createdAt.toDate().toISOString() : null,
    }));
  } catch (error) {
    console.error("Error getting products:", error);
    throw error;
  }
}

/**
 * Update an existing product document.
 * @param productId - The ID of the product.
 * @param updateData - The data to update.
 */
export async function updateProduct(
  productId: string,
  updateData: Record<string, any>
): Promise<void> {
  if (!productId) throw new Error("Invalid productId");
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, updateData);
}

/**
 * updateProductImageReference:
 *   Updates the 'photoURL' field of a product document with the provided image URL.
 *
 * @param productId - The ID of the product.
 * @param imageUrl - The new image URL to set.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateProductImageReference(
  productId: string,
  imageUrl: string
): Promise<void> {
  if (!productId) throw new Error("Invalid productId");
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, { photoURL: imageUrl });
}

// -----------------------------
// REVIEWS COLLECTION FUNCTIONS
// -----------------------------

export async function addReview(
  reviewData: Omit<Review, "reviewId" | "createdAt"> 
): Promise<Review> {
  try {
    const reviewRef = await addDoc(collection(db, "reviews"), {
      ...reviewData,
      createdAt: Timestamp.now(), 
    });

    return {
      reviewId: reviewRef.id,
      ...reviewData,
      createdAt: Timestamp.now().toDate().toISOString(), 
    };
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
}



/**
 * Retrieve reviews for a given product ID.
 * @param productId - The product ID to filter reviews.
 * @returns An array of review objects.
 */
export async function getReviewsByProductId(
  productId: string
): Promise<Array<Record<string, any>>> {
  if (!productId) throw new Error("Invalid productId");
  try {
    const q = query(
      collection(db, "reviews"),
      where("productId", "==", productId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
    }));
  } catch (error) {
    console.error("Error getting reviews:", error);
    throw error;
  }
}

/**
 * Update an existing review.
 * @param reviewId - The review ID.
 * @param updateData - The data to update.
 */
export async function updateReview(
  reviewId: string,
  updateData: Record<string, any>
): Promise<void> {
  if (!reviewId) throw new Error("Invalid reviewId");
  const reviewRef = doc(db, "reviews", reviewId);
  await updateDoc(reviewRef, updateData);
}

// -----------------------------
// FLAVOR REQUESTS COLLECTION FUNCTIONS
// -----------------------------

/**
 * Add a new flavor request.
 * @param flavorData - Object containing flavorName, description, referenceURL, createdByUserId, etc.
 * @returns The reference to the newly added flavor request document.
 */
export async function addFlavorRequest(
  flavorData: Record<string, any>
): Promise<DocumentReference> {
  try {
    const flavorRef = await addDoc(collection(db, "flavorRequests"), {
      ...flavorData,
      votes: 0,
      voteUserIds: [],
      createdAt: Timestamp.now(),
    });
    return flavorRef;
  } catch (error) {
    console.error("Error adding flavor request:", error);
    throw error;
  }
}

/**
 * Retrieve all flavor requests ordered by creation date (newest first).
 * @returns An array of flavor request objects.
 */
export async function getFlavorRequests(): Promise<Array<Record<string, any>>> {
  try {
    const q = query(
      collection(db, "flavorRequests"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        createdByUserId: data.createdByUserId,
        description: data.description,
        flavorName: data.flavorName,
        referenceURL: data.referenceURL,
        voteUserIds: data.voteUserIds,
        votes: data.votes,
      };
    });
  } catch (error) {
    console.error("Error getting flavor requests:", error);
    throw error;
  }
}

/**
 * Vote on a flavor request.
 * Uses a transaction to ensure that the same user can only vote once.
 * @param requestId - The flavor request ID.
 * @param userId - The ID of the user voting.
 */
export async function voteFlavorRequest(
  requestId: string,
  userId: string
): Promise<void> {
  if (!requestId || !userId) throw new Error("Invalid parameters");
  const flavorRequestRef = doc(db, "flavorRequests", requestId);
  try {
    await runTransaction(db, async (transaction) => {
      const flavorDoc = await transaction.get(flavorRequestRef);
      if (!flavorDoc.exists()) {
        throw new Error("Flavor request does not exist!");
      }
      const data = flavorDoc.data();
      if (
        data.voteUserIds &&
        Array.isArray(data.voteUserIds) &&
        data.voteUserIds.includes(userId)
      ) {
        throw new Error("User has already voted on this flavor request");
      }
      const newVotes = (data.votes || 0) + 1;
      transaction.update(flavorRequestRef, {
        votes: newVotes,
        voteUserIds: arrayUnion(userId),
      });
    });
  } catch (error) {
    console.error("Error voting flavor request:", error);
    throw error;
  }
}

/**
 * Subscribe to flavor requests for real-time updates.
 * @param callback - Function that receives the flavor requests array.
 * @returns A function to unsubscribe from the snapshot listener.
 */
export function subscribeToFlavorRequests(
  callback: (data: Array<Record<string, any>>) => void
): () => void {
  const q = query(
    collection(db, "flavorRequests"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (querySnapshot) => {
    const flavorRequests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp).toDate(),
    }));
    callback(flavorRequests);
  });
}
