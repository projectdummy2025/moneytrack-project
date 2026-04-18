"use client";

import React, { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import Cookies from "js-cookie";

export default function OtpVerificationPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otpCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      // Set cookie di client side (cadangan)
      Cookies.set("moneytrack_session", data.userId, { expires: 7, path: '/' });
      
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10 max-w-[430px] mx-auto">
      <h1 className="text-heading-xl font-bold text-[#1e232c] leading-tight mb-3 mt-10">
        OTP Verification
      </h1>
      <p className="text-body-lg font-medium text-[#838ba1] leading-relaxed mb-8">
        Enter the verification code we just sent on your email address.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium mb-6">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-8 justify-center">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={isLoading}
            className={`w-[46px] h-[56px] text-center rounded-xl outline-none transition-all font-bold text-heading shrink-0 ${
              digit 
                ? "border-[1.5px] border-[#35c2c1] bg-white text-[#1e232c]" 
                : "border border-[#e8ecf4] bg-[#f7f8f9] text-[#1e232c]"
            } disabled:opacity-50`}
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        disabled={isLoading}
        className="w-full h-[56px] bg-[#1e232c] rounded-xl flex items-center justify-center font-semibold text-body text-white hover:bg-[#2d3441] transition-all active:scale-95 shadow-lg shadow-black/10 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={20} />
            <span>Verifying...</span>
          </div>
        ) : (
          "Verify"
        )}
      </button>

      <div className="mt-auto pb-6 text-center pt-10">
        <p className="text-body text-[#1e232c] font-medium">
          Didn&apos;t received code?{" "}
          <button
            onClick={() => {}}
            className="font-bold text-[#35c2c1] hover:underline"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}
