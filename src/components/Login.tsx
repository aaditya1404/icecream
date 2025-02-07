"use client";
import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import { useDispatch } from "react-redux";
import { setAppUser, setLoading, setError } from "../redux/appUserSlice";
import { auth } from "../firebase/clientApp";
import UserInfoForm from "./UserInfoForm";
import { addUser, getUserById, updateUser } from "@/firebase/firestore";
import UpdateModal from "./UpdateModal";
import { uploadUserPhoto } from "@/firebase/storage";

const PhoneAuth = () => {

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<firebase.auth.ConfirmationResult | null>(null);
  const [user, setUser] = useState<firebase.User | null>(null); 
  const [userData, setUserData] = useState<{ name: string; phone: string; photoURL: string } | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => console.log("Auth persistence enabled"))
        .catch((error) => console.error("Error setting persistence:", error));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          console.log("User signed in:", firebaseUser.uid);
          setUser(firebaseUser);
          try {
            dispatch(setLoading(true));
            console.log(firebaseUser.uid)
            const fetchedUser = await getUserById(firebaseUser.uid);
            if (fetchedUser) {
              setUserData(fetchedUser as { name: string; phone: string; photoURL: string });
            } else {
              console.warn("User data not found in Firestore, showing form.");
              setUserData(null);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            dispatch(setError(error instanceof Error ? error.message : "An unknown error occurred"));
          } finally {
            dispatch(setLoading(false));
          }
        } else {
          console.log("🚪 No user signed in.");
          setUser(null);
          setUserData(null);
        }
      });

      return () => unsubscribe();
    }
  }, [dispatch]);


  const handlePhoneNumberSubmit = async () => {
    try {
      dispatch(setLoading(true));
      const recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
        size: "invisible",
      });
      const result = await auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
      setConfirmationResult(result);
      setIsOtpSent(true);
    } catch (error) {
      console.error("Error during sign-in with phone:", error);
      dispatch(setError(error instanceof Error ? error.message : "An unknown error occurred"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleOtpSubmit = async () => {
    if (confirmationResult) {
      try {
        dispatch(setLoading(true));
        const userCredential = await confirmationResult.confirm(otp);
        setUser(userCredential.user);
        setIsOtpSent(false);

        const fetchedUser = await getUserById(userCredential?.user?.uid ?? "");
        if (fetchedUser) {
          setUserData(fetchedUser as { name: string; phone: string; photoURL: string });
        } else {
          setUserData(null);
        }

      }
      catch (error) {
        console.error("Error verifying OTP:", error);
        dispatch(setError(error instanceof Error ? error.message : "An unknown error occurred"));
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      dispatch(setAppUser(null)); 
    } catch (error) {
      console.error("Error signing out:", error);
      dispatch(setError(error instanceof Error ? error.message : "An unknown error occurred"));
    }
  };

  const handleUserInfoSubmit = async (data: { name: string; phone: string; image: File | null }) => {
    console.log("User Info Submitted:", data);

    if (!user) return;

    try {
      let photoURL = user.photoURL || ""; 

      if (data.image) {

        photoURL = await uploadUserPhoto(user.uid, data.image);
      }

      const newUser = { uid: user.uid, name: data.name, phone: data.phone, photoURL };

      await addUser(newUser);
      setUserData(newUser); 

      console.log("User data added to Firestore:", newUser);
    } catch (error) {
      console.error("Error adding user to Firestore:", error);
      dispatch(setError(error instanceof Error ? error.message : "An unknown error occurred"));
    }
  };

  const handleUpdateUserInfo = async (data: { name: string; image: File | null }) => {

    if (!user || !userData) return;

    try {
      let photoURL = userData.photoURL;

      if (data.image) {
        photoURL = await uploadUserPhoto(user.uid, data.image);
      }

      const updatedUser = { ...userData, name: data.name, photoURL };

      await updateUser(user.uid, { name: updatedUser.name, photoURL }); 
      console.log("User data updated in Firestore:", updatedUser);

      setUserData(updatedUser); 
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error("Error updating user in Firestore:", error);
      dispatch(setError(error instanceof Error ? error.message : "An unknown error occurred"));
    }
  };



  console.log("userData ", userData);
  console.log("user", user);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div id="recaptcha-container"></div>

      {user ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Signed in as {userData?.name || "User"}
          </h2>

          {/* Sign Out Button */}
          <div className="text-center">
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </div>

          {/* If user data exists in Firestore, display it */}
          {userData ? (
            <div className="text-center text-gray-700">
              <h3 className="font-semibold">Name: {userData.name}</h3>
              <h3 className="font-semibold">Phone: {userData.phone}</h3>
              {userData.photoURL && <img src={userData.photoURL} alt="User Avatar" className="mx-auto rounded-full w-24 h-24 mt-4" />}
              {/* Update Button */}
              <div className="text-center mt-4">
                <button
                  onClick={() => setIsUpdateModalOpen(true)} // Open the modal when clicked
                  className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
                >
                  Update Information
                </button>
              </div>
            </div>

          ) : (
            // If user data doesn't exist, show the form to collect user details
            <UserInfoForm onSubmit={handleUserInfoSubmit} />
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Phone Number Input and Send OTP Button */}
          {!isOtpSent ? (
            <div className="space-y-4">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handlePhoneNumberSubmit}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              >
                Send OTP
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleOtpSubmit}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              >
                Verify OTP
              </button>
            </div>
          )}
        </div>
      )}
      {/* Update Modal */}
      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)} // Close modal when clicking outside or cancel
        onSubmit={handleUpdateUserInfo}
        initialData={userData || { name: "", phone: "", photoURL: "" }}
      />
    </div>

  );
};

export default PhoneAuth;
