"use client";

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAppUser, setLoading } from '../redux/appUserSlice';
import { auth } from '../firebase/clientApp'; 

// Define the structure for user data
interface UserData {
  uid: string; // Unique user ID
  name: string; // User's name or phone number
  photoURL: string; // User profile picture URL
}

// Custom authentication hook to manage user state
const UseAuth = () => {

  const dispatch = useDispatch(); // Redux dispatch function

  // State to store authenticated user data
  const [user, setUser] = useState<UserData | null>(null);

  // Effect to handle authentication state changes
  useEffect(() => {
    dispatch(setLoading(true)); // Set loading state while checking authentication

    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      dispatch(setLoading(false)); // Stop loading once authentication check is done

      if (user) {
        // Extract user data from Firebase auth object
        const userData = {
          uid: user?.uid ?? "", // Assign user ID or empty string if undefined
          name: user?.phoneNumber ?? "", // Use phone number as fallback for name
          photoURL : user?.photoURL ?? "" // Assign profile picture or empty string
        };
        setUser(userData); // Update local state with user data
        dispatch(setAppUser(userData)); // Store user data in Redux
      } else {
        setUser(null); // Reset local state when user is signed out
        dispatch(setAppUser(null)); // Clear user data from Redux store
      }
    });

    // Cleanup function to unsubscribe from auth listener when component unmounts
    return () => unsubscribe(); 
  }, [dispatch]);

  return null; // This component does not render any UI
};

export default UseAuth;
