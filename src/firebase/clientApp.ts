// src/lib/firebase/clientApp.ts
'use client';

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { firebaseConfig } from "./config";

// Initialize the Firebase app only once.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();


if (typeof window !== "undefined") {
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => console.log("Auth persistence enabled"))
    .catch((error) => {
      console.error("Error setting LOCAL persistence, falling back to SESSION:", error);
      auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => console.log("Using SESSION persistence"))
        .catch((error) => console.error("Error setting SESSION persistence:", error));
    });
}

// Export the app instance if needed.
export default firebase.app();
