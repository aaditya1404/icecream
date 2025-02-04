// src/lib/firebase/auth.ts
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { auth } from "./clientApp";

/**
 * onAuthStateChanged:
 * Registers a callback that is called whenever the authentication state changes.
 *
 * @param cb - A callback function that receives the current user (or null if signed out).
 * @returns A function to unsubscribe from the auth state changes.
 */
export function onAuthStateChanged(
  cb: (user: firebase.User | null) => void
): firebase.Unsubscribe {
  return auth.onAuthStateChanged(cb);
}

/**
 * signInWithPhone:
 * Initiates a phone number sign-in and sends an OTP.
 *
 * @param phoneNumber - The phone number in E.164 format (e.g., "+1234567890").
 * @param recaptchaVerifier - The reCAPTCHA verifier instance.
 * @returns A promise that resolves to a ConfirmationResult used for OTP verification.
 */
export async function signInWithPhone(
  phoneNumber: string,
  recaptchaVerifier: firebase.auth.RecaptchaVerifier
): Promise<firebase.auth.ConfirmationResult> {
  try {
    const confirmationResult = await auth.signInWithPhoneNumber(
      phoneNumber,
      recaptchaVerifier
    );
    return confirmationResult;
  } catch (error) {
    console.error("Error during sign in with phone:", error);
    throw error;
  }
}

/**
 * verifyOTP:
 * Confirms the OTP sent to the user's phone.
 *
 * @param confirmationResult - The confirmation object returned by signInWithPhone.
 * @param otp - The OTP code entered by the user.
 * @returns A promise that resolves to the authenticated user.
 */
export async function verifyOTP(
  confirmationResult: firebase.auth.ConfirmationResult,
  otp: string
): Promise<firebase.User> {
  try {
    const result = await confirmationResult.confirm(otp);
    if (!result.user) {
      throw new Error("No user returned after OTP confirmation.");
    }
    return result.user;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
}

/**
 * signOut:
 * Signs out the current user.
 *
 * @returns A promise that resolves when the user has been signed out.
 */
export async function signOut(): Promise<void> {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}
