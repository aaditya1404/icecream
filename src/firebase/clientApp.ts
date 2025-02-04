// src/lib/firebase/clientApp.ts
'use client';

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { firebaseConfig } from "./config";


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();


auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .then(() => {
    console.log('Firebase persistence is set to LOCAL.');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

export { auth };
