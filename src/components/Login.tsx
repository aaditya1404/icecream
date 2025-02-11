"use client";
import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import { useDispatch } from "react-redux";
import { setAppUser, setLoading, setError } from "../redux/appUserSlice";
import { auth } from "../firebase/clientApp";
import UserInfoForm from "./Forms/UserInfoForm";
import { addUser, getUserById, updateUser } from "@/firebase/firestore";
import UpdateModal from "./UpdateModal";
import { uploadUserPhoto } from "@/firebase/storage";
import { useSelector } from "react-redux";
import LottieLoader from "./LottieLoader";
import Image from "next/image";

const PhoneAuth = () => {

  // State for handling user authentication and input fields
  const [phoneNumber, setPhoneNumber] = useState(""); // Stores entered phone number
  const [otp, setOtp] = useState(""); // Stores entered OTP
  const [isOtpSent, setIsOtpSent] = useState(false); // Tracks whether OTP has been sent

  // Stores the OTP confirmation result
  const [confirmationResult, setConfirmationResult] = useState<firebase.auth.ConfirmationResult | null>(null);
  const [user, setUser] = useState<firebase.User | null>(null); // Stores authenticated user

  // Stores user data from Firestore
  const [appUserData, setAppUserData] = useState<{ name: string; phone: string; photoURL: string } | null>(null);

  // Controls update modal visibility
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Redux dispatch function
  const dispatch = useDispatch();

  // Get loading state from Redux store
  const isLoading = useSelector((state: any) => state.appUser.loading);

  // Ensures authentication persistence when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => console.log("Auth persistence enabled"))
        .catch((error) => console.error("Error setting persistence:", error));
    }
  }, []);

  // Handles authentication state changes (sign-in/out)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {

          // Update user state
          setUser(firebaseUser);
          try {
            dispatch(setLoading(true));

            // Fetch user details from Firestore
            const fetchedUser = await getUserById(firebaseUser.uid);
            if (fetchedUser) {
              // Store user data
              setAppUserData(fetchedUser as { name: string; phone: string; photoURL: string });
            } else {
              console.warn("User data not found in Firestore, showing form.");
              setAppUserData(null); // Show user info form if data is missing
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
          setAppUserData(null);
        }
      });

      // Cleanup function
      return () => unsubscribe();
    }
  }, [dispatch]);

  // Handles phone number submission to send OTP
  const handlePhoneNumberSubmit = async () => {
    try {
      dispatch(setLoading(true));
      const recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
        size: "invisible",
      });
      const result = await auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier);

      // Store confirmation result
      setConfirmationResult(result);

      // Update state to show OTP input
      setIsOtpSent(true);
    } catch (error) {
      console.error("Error during sign-in with phone:", error);
      dispatch(setError(error instanceof Error ? error.message : "An unknown error occurred"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Handles OTP verification and user authentication
  const handleOtpSubmit = async () => {
    if (confirmationResult) {
      try {
        dispatch(setLoading(true));
        const userCredential = await confirmationResult.confirm(otp); // Verify OTP
        setUser(userCredential.user); // Update user state
        setIsOtpSent(false); // Hide OTP input

        // Fetch user data from Firestore
        const fetchedUser = await getUserById(userCredential?.user?.uid ?? "");
        if (fetchedUser) {
          setAppUserData(fetchedUser as { name: string; phone: string; photoURL: string });
        } else {

          // Create a new user if not found in Firestore
          const newUser = {
            uid: userCredential?.user?.uid,
            name: "",
            phone: phoneNumber,
            photoURL: "",
          };
          await addUser(newUser);
          setAppUserData(null);
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

  // Handles user sign-out
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

  // Handles new user information submission
  const handleUserInfoSubmit = async (data: { name: string; image: File | null }) => {
    console.log("User Info Submitted:", data);
    if (!user) return;
    try {
      let photoURL = user.photoURL || "";
      if (data.image) {
        photoURL = await uploadUserPhoto(user.uid, data.image);
      }
      const existingUser = await getUserById(user.uid);
      if (existingUser) {
        const updatedUser = {
          name: data.name,
          photoURL,
          phone: existingUser.phone || phoneNumber // Ensure phone is retained
        };
        // Update existing user with new data
        await updateUser(user.uid, updatedUser);
        setAppUserData(updatedUser);
        console.log("User data updated in Firestore:", { name: data.name, photoURL });
      } else {
        // If user doesn't exist, create a new one
        const newUser = { uid: user.uid, phone: phoneNumber, name: data.name, photoURL };
        await addUser(newUser);
        setAppUserData(newUser);
        console.log("User data added to Firestore:", newUser);
      }
    } catch (error) {
      console.error("Error adding user to Firestore:", error);
      dispatch(setError(error instanceof Error ? error.message : "An unknown error occurred"));
    }
  };

  const handleUpdateUserInfo = async (data: { name: string; image: File | null }) => {
    if (!user || !appUserData) return;
    try {
      let photoURL = appUserData.photoURL;
      if (data.image) {
        photoURL = await uploadUserPhoto(user.uid, data.image);
      }
      const updatedUser = { ...appUserData, name: data.name, photoURL };
      await updateUser(user.uid, { name: updatedUser.name, photoURL });
      console.log("User data updated in Firestore:", updatedUser);
      setAppUserData(updatedUser);
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error("Error updating user in Firestore:", error);
      dispatch(setError(error instanceof Error ? error.message : "An unknown error occurred"));
    }
  };

  return (
    <>

      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">

        <div className="w-[331px] translate-y-10 max-w-lg mx-auto p-6 bg-[#071005] shadow-[4px_4px_10px_#2f3e0d] rounded-2xl h-[469px] flex flex-col justify-center">
          <div id="recaptcha-container"></div>

          {user ? (
            <div className="space-y-6">

              {/* If user data exists in Firestore, display it */}
              {appUserData ? (
                <div className="text-center text-gray-700">
                  {appUserData.photoURL && (
                    <img src={appUserData.photoURL}
                      alt="User Avatar"
                      className="mx-auto rounded-full w-[77px] h-[77px] mb-10" />
                  )}
                  <h1 className="text-[17.89px] text-white font-semibold">Signed in as {appUserData.name}</h1>
                  {/* <h3 className="font-semibold">Name: {appUserData.name}</h3> */}
                  <h3 className="font-semibold text-[12px] text-[#bcb7b7]">{appUserData.phone}</h3>
                  {/* Sign Out Button */}
                  {user && (
                    <div className="text-center px-[42px] py-[13px] mt-5">
                      <button
                        onClick={handleSignOut}
                        className="w-[167px] h-[49px] text-[16px] font-medium sm:w-auto bg-white opacity-40 text-[#101901] px-6 py-2 rounded-full hover:bg-red-600 transition"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                  {/* Update Button */}
                  <div className="text-center px-[42px] py-[13px]">
                    <button
                      onClick={() => setIsUpdateModalOpen(true)} // Open the modal when clicked
                      className="w-[167px] h-[49px] text-[16px] bg-[#a8ff00] text-[#101901] font-medium px-6 py-2 rounded-full hover:bg-green-600 transition"
                    >
                      Update
                    </button>
                  </div>
                </div>

              ) : (
                // If user data doesn't exist, show the form to collect user details
                <UserInfoForm onSubmit={handleUserInfoSubmit} />
              )}
            </div>
          ) : (
            <div className="">
              {/* Phone Number Input and Send OTP Button */}
              {!isOtpSent ? (
                <>
                  <img
                    src="/logo.png"
                    alt="Company Logo"
                    className="mx-auto mt-4 w-[48px] h-[65px] mb-4"
                  />
                  <img
                    src="/companyName.png"
                    alt="comapanyName"
                    className="w-[397px] h-[51px]"
                  />
                  <p
                    className="text-white text-center text-[15px] mb-8 -translate-y-2">
                    If you can dream it, we can flavor it.
                  </p>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-[293px] h-[49px] px-4 py-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a8ff00]"
                    />
                    {isLoading ? (
                      <LottieLoader />
                    ) : (
                      <div className="w-full flex items-center justify-center">
                        <button
                          onClick={handlePhoneNumberSubmit}
                          className="bg-[#a8ff00] w-[167px] h-[49px] text-black font-medium text-[16px] py-2 px-8 rounded-full transition"
                        >
                          Send OTP
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <img
                    src="/logo.png"
                    alt="Company Logo"
                    className="mx-auto mt-4 w-[48px] h-[65px] mb-16"
                  />
                  <p className="text-white text-[17.89px] font-semibold text-center">Enter your OTP</p>
                  <p className="text-[#bcb7b7] font-semibold text-[12px] text-center mb-8">We have sent to {phoneNumber}</p>
                  <div className="">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter your OTP"
                      className="w-[293px] h-[49px] px-4 py-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a8ff00]"
                    />
                    <div className="w-full flex items-center justify-center px-[42px] py-[13px]">
                      <button
                        onClick={handleOtpSubmit}
                        className="bg-[#a8ff00] w-[167px] h-[49px] text-black font-medium text-[16px] py-2 px-8 rounded-full transition"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          {/* Update Modal */}
          <UpdateModal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)} // Close modal when clicking outside or cancel
            onSubmit={handleUpdateUserInfo}
            initialData={appUserData || { name: "", phone: "", photoURL: "" }}
          />
        </div>

      </div>
      {/* {user && (
        <div className="text-center">
          <button
            onClick={handleSignOut}
            className="w-full sm:w-auto bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </div>
      )} */}
    </>
  );
};

export default PhoneAuth;
