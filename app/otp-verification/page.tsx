"use client";

import React, { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

export default function OtpVerificationPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
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

  const handleVerify = () => {
    // UI logic only
    router.push("/create-new-password");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10 max-w-[430px] mx-auto">
      {/* Title & Description */}
      <h1 className="text-[30px] font-bold text-[#1e232c] leading-tight mb-3 mt-10">
        OTP Verification
      </h1>
      <p className="text-[16px] font-medium text-[#838ba1] leading-relaxed mb-8">
        Enter the verification code we just sent on your email address.
      </p>

      {/* OTP Inputs — 6 boxes */}
      <div className="flex gap-2 mb-8">
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
            className={`w-[46px] h-[56px] text-center rounded-xl outline-none transition-all font-bold text-[20px] shrink-0 ${
              digit 
                ? "border-[1.5px] border-[#35c2c1] bg-white text-[#1e232c]" 
                : "border border-[#e8ecf4] bg-[#f7f8f9] text-[#1e232c]"
            }`}
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        className="w-full h-[56px] bg-[#1e232c] rounded-xl flex items-center justify-center font-semibold text-[15px] text-white hover:bg-[#2d3441] transition-all active:scale-95 shadow-lg shadow-black/10"
      >
        Verify
      </button>

      {/* Resend link */}
      <div className="mt-auto pb-6 text-center pt-10">
        <p className="text-[15px] text-[#1e232c] font-medium">
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
