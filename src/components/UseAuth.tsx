"use client";

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAppUser, setLoading } from '../redux/appUserSlice';
import { auth } from '../firebase/clientApp'; 

interface UserData {
  uid: string;
  name: string;
  photoURL: string;
}

const UseAuth = () => {

  const dispatch = useDispatch();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    dispatch(setLoading(true));

    const unsubscribe = auth.onAuthStateChanged((user) => {
      dispatch(setLoading(false));

      if (user) {
        const userData = {
          uid: user?.uid ?? "",
          name: user?.phoneNumber ?? "",
          photoURL : user?.photoURL ?? ""
        };
        
        setUser(userData);
        dispatch(setAppUser(userData));
      } else {

        setUser(null);
        dispatch(setAppUser(null)); 
      }

    });

    return () => unsubscribe(); 
  }, [dispatch]);

  return null;
};

export default UseAuth;
