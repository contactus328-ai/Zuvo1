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

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[0-9]{10}$/.test(phone);

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
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <span className="text-gray-700 font-medium">Detecting Gmail Account...</span>
                </>
              ) : (
                <>
                  <img src="/assets/gmail-logo.png" alt="Gmail" className="w-5 h-5 object-contain" />
                  <span className="text-gray-700 font-medium">Continue with Gmail</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-gray-500 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Manual Sign In Button */}
            <button
              onClick={() => setSignInMethod("manual")}
              className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg py-3 px-4 font-medium transition-colors text-center"
            >
              Sign in with Email id and Phone Number
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    );
  }

  if (signInMethod === "manual") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="bg-white text-black p-4 flex items-center border-b border-gray-200">
          <button
            onClick={() => setSignInMethod("choose")}
            className="mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">Sign In</h1>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Your Details</h2>
            <p className="text-gray-600">We'll send an OTP to verify your phone number</p>
          </div>

          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email && validateEmail(e.target.value)) {
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  className={`flex-1 h-12 px-4 bg-white border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg text-base text-black placeholder-black`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`flex-1 h-12 px-4 bg-white border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } rounded-lg text-base text-black placeholder-black`}
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                />
                <button
                  onClick={handleManualSignIn}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm"
                >
                  Send OTP
                </button>
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (signInMethod === "google") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="bg-white text-black p-4 flex items-center border-b border-gray-200">
          <button
            onClick={() => setSignInMethod("choose")}
            className="mr-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">Complete Sign In</h1>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Phone Number Required</h2>
            <p className="text-gray-600">We need your phone number to send important event updates</p>
          </div>

          {/* Google Email Display */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address (from Google)</label>
            <div className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg flex items-center text-base text-gray-600">
              {email}
            </div>
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="flex gap-2">
              <input
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`flex-1 h-12 px-4 bg-white border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } rounded-lg text-base text-black placeholder-black`}
                placeholder="Enter 10-digit phone number"
                maxLength={10}
              />
              <button
                onClick={handleGooglePhoneSubmit}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm"
              >
                Send OTP
              </button>
            </div>
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
