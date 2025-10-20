import { useState } from "react";
import { ArrowLeft } from "lucide-react";

/**
 * SignIn Component - Handles user authentication via Gmail or manual email/phone
 *
 * Note: This is a prototype implementation without real Google OAuth.
 * For production, integrate with Google Identity Services and obtain proper client credentials.
 */

interface SignInProps {
  onSignInComplete: (email: string, phone: string, isGoogleSignIn: boolean) => void;
}

export function SignIn({ onSignInComplete }: SignInProps) {
  const [signInMethod, setSignInMethod] = useState<"choose" | "manual" | "google">("choose");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [isDetectingEmail, setIsDetectingEmail] = useState(false);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePhone = (value: string) => /^[0-9]{10}$/.test(value);

  const handleManualSignIn = () => {
    const newErrors: { email?: string; phone?: string } = {};
    if (!email || !validateEmail(email)) newErrors.email = "Please enter a valid email address";
    if (!phone || !validatePhone(phone)) newErrors.phone = "Please enter a valid 10-digit phone number";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) onSignInComplete(email, phone, false);
  };

  const handleGoogleSignIn = async () => {
    setIsDetectingEmail(true);
    try {
      const detectedEmail = await detectDeviceEmail();
      if (detectedEmail) {
        setEmail(detectedEmail);
        setSignInMethod("google");
      } else {
        handleGoogleSignInFallback();
      }
    } catch {
      handleGoogleSignInFallback();
    } finally {
      setTimeout(() => setIsDetectingEmail(false), 1000);
    }
  };

  const detectDeviceEmail = async (): Promise<string | null> => {
    try {
      const lastGmail = localStorage.getItem("zhevents_last_gmail");
      if (lastGmail && lastGmail.includes("@gmail.com")) return lastGmail;

      const emailInputs = document.querySelectorAll('input[type="email"]');
      for (const input of emailInputs) {
        const value = (input as HTMLInputElement).value;
        if (value && value.includes("@gmail.com")) return value;
      }

      const sessionEmail = sessionStorage.getItem("userEmail");
      if (sessionEmail && sessionEmail.includes("@gmail.com")) return sessionEmail;

      return null;
    } catch {
      return null;
    }
  };

  const handleGoogleSignInFallback = () => {
    let detectedEmail = "";
    const previousEmail = localStorage.getItem("zhevents_last_gmail");
    if (previousEmail && previousEmail.includes("@gmail.com")) {
      detectedEmail = previousEmail;
    } else {
      const deviceInfo = getDeviceInfo();
      const timestamp = Date.now().toString().slice(-4);
      if (deviceInfo.userAgent.includes("Android")) {
        detectedEmail = `android.user${timestamp}@gmail.com`;
      } else if (deviceInfo.userAgent.includes("iPhone") || deviceInfo.userAgent.includes("iPad")) {
        detectedEmail = `iphone.user${timestamp}@gmail.com`;
      } else {
        detectedEmail = `mobile.user${timestamp}@gmail.com`;
      }
    }
    localStorage.setItem("zhevents_last_gmail", detectedEmail);
    setEmail(detectedEmail);
    setSignInMethod("google");
  };

  const getDeviceInfo = () => ({
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
    platform: typeof navigator !== "undefined" ? navigator.platform : "",
    language: typeof navigator !== "undefined" ? navigator.language : "en",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  });

  const handleGooglePhoneSubmit = () => {
    const newErrors: { phone?: string } = {};
    if (!phone || !validatePhone(phone)) newErrors.phone = "Please enter a valid 10-digit phone number";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) onSignInComplete(email, phone, true);
  };

  const handlePhoneChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
    setPhone(numericValue);
    if (errors.phone && numericValue.length === 10) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  if (signInMethod === "choose") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Content */}
        <div className="flex-1 flex flex-col justify-center px-6 bg-gray-100">
          <div className="text-center mb-8">
            {/* Logo (served from public/assets) */}
            <div className="mb-6">
              <img src="/assets/zuvo-logo.png" alt="Zuvo Logo" className="mx-auto h-16 w-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Zuvo</h2>
            <p className="text-gray-600">Choose how you'd like to sign in</p>
          </div>

          <div className="space-y-4">
            {/* Gmail Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isDetectingEmail}
              className={`w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 rounded-lg py-3 px-4 transition-colors ${
                isDetectingEmail ? "opacity-75 cursor-not-allowed" : "hover:bg-gray-50"
              }`}
            >
              {isDetectingEmail ? (
                <>
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="
