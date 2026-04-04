"use client";

import React, { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@shell/auth/AuthLayout";
import { BackButton } from "@shell/auth/BackButton";

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
    <AuthLayout>
      <div className="mt-9">
        <BackButton to="/forgot-password" />
      </div>

      {/* Title & Description */}
      <h1
        style={{
          fontFamily: "Urbanist, sans-serif",
          fontWeight: 700,
          fontSize: 30,
          color: "#1e232c",
          lineHeight: 1.3,
          letterSpacing: -0.3,
          marginBottom: 12,
        }}
      >
        OTP Verification
      </h1>
      <p
        style={{
          fontFamily: "Urbanist, sans-serif",
          fontWeight: 500,
          fontSize: 16,
          color: "#838ba1",
          lineHeight: 1.5,
          marginBottom: 36,
        }}
      >
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
            className="w-[46px] h-[56px] text-center rounded-[8px] outline-none transition-colors shrink-0"
            style={{
              fontFamily: "Urbanist, sans-serif",
              fontWeight: 700,
              fontSize: 20,
              color: "#1e232c",
              border: digit ? "1.5px solid #35c2c1" : "1px solid #e8ecf4",
              background: digit ? "white" : "#f7f8f9",
            }}
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        className="w-full h-[56px] bg-[#1e232c] rounded-[8px] flex items-center justify-center cursor-pointer hover:bg-[#2d3441] transition-colors"
        style={{
          fontFamily: "Urbanist, sans-serif",
          fontWeight: 600,
          fontSize: 15,
          color: "white",
        }}
      >
        Verify
      </button>

      {/* Resend link */}
      <div className="flex-1 flex items-end justify-center pb-4 mt-8">
        <p style={{ fontFamily: "Urbanist, sans-serif", fontSize: 15, color: "#1e232c" }}>
          <span style={{ fontWeight: 500 }}>Didn&apos;t received code? </span>
          <button
            onClick={() => {}}
            style={{
              fontWeight: 700,
              color: "#35c2c1",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "Urbanist, sans-serif",
              fontSize: 15,
            }}
          >
            Resend
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
