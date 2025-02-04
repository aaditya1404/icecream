// components/UseAuth.tsx
"use client";
// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { setUser, setLoading } from '../redux/userSlice';
// import { auth } from '../firebase/clientApp';

// const UseAuth = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       dispatch(setLoading(false));
//       if (user) {
//         dispatch(setUser(user));
//       } else {
//         dispatch(setUser(null));
//       }
//     });

//     return () => unsubscribe(); // Cleanup on component unmount
//   }, [dispatch]);

//   return null; // You can choose to return a loading state or null
// };

// export default UseAuth;

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setLoading } from '../redux/userSlice';
import { auth } from '../firebase/clientApp';  // Ensure Firebase is initialized

const UseAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {

    // Subscribe to the authentication state change
    const unsubscribe = auth.onAuthStateChanged((user) => {
      dispatch(setLoading(false));
      if (user) {
        // Store only necessary data (uid, email, etc.)
        const userData = {
          uid: user.uid,
          email: user.email,
        };
        dispatch(setUser(userData));
      } else {
        dispatch(setUser(null)); // Clear user data if not logged in
      }
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, [dispatch]);

  return null; // You can return null or a loading state
};

export default UseAuth;
