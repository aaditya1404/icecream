// components/PhoneAuth.tsx
"use client";
import { useState } from 'react';
import firebase from 'firebase/compat/app';
import { useDispatch } from 'react-redux';
import { setUser, setLoading, setError } from '../redux/userSlice';
import { auth } from '../firebase/clientApp';

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<firebase.auth.ConfirmationResult | null>(null);
  
  const dispatch = useDispatch();
  
  const handlePhoneNumberSubmit = async () => {
    try {
      dispatch(setLoading(true));
      const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
      });
      const result = await auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier);
      setConfirmationResult(result);
      setIsOtpSent(true);
    } catch (error) {
      console.error('Error during sign-in with phone:', error);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleOtpSubmit = async () => {
    if (confirmationResult) {
      try {
        dispatch(setLoading(true));
        const userCredential = await confirmationResult.confirm(otp);
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        dispatch(setUser(userData));
        setIsOtpSent(false); // Reset after successful OTP verification
      } catch (error) {
        console.error('Error verifying OTP:', error);
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  return (
    <div>
      <div id="recaptcha-container"></div>
      {!isOtpSent ? (
        <div>
          <input 
            type="text" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            placeholder="Enter phone number" 
          />
          <button onClick={handlePhoneNumberSubmit}>Send OTP</button>
        </div>
      ) : (
        <div>
          <input 
            type="text" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            placeholder="Enter OTP" 
          />
          <button onClick={handleOtpSubmit}>Verify OTP</button>
        </div>
      )}
    </div>
  );
};

export default PhoneAuth;
