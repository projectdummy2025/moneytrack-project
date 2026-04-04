"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@shell/auth/AuthLayout";
import { BackButton } from "@shell/auth/BackButton";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSendCode = () => {
    // UI logic only
    router.push("/otp-verification");
  };

  return (
    <AuthLayout>
      <div className="mt-9">
        <BackButton to="/login" />
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
        Forgot Password?
      </h1>
      <p
        style={{
          fontFamily: "Urbanist, sans-serif",
          fontWeight: 500,
          fontSize: 16,
          color: "#8391a1",
          lineHeight: 1.5,
          marginBottom: 36,
        }}
      >
        Don&apos;t worry! It occurs. Please enter the email address linked with your account.
      </p>

      {/* Email Input */}
      <div className="mb-6">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[56px] bg-[#f7f8f9] border border-[#e8ecf4] rounded-[8px] px-5 outline-none focus:border-[#35c2c1] transition-colors"
          style={{
            fontFamily: "Urbanist, sans-serif",
            fontWeight: 500,
            fontSize: 15,
            color: "#1e232c",
          }}
        />
      </div>

      {/* Send Code Button */}
      <button
        onClick={handleSendCode}
        className="w-full h-[56px] bg-[#1e232c] rounded-[8px] flex items-center justify-center cursor-pointer hover:bg-[#2d3441] transition-colors"
        style={{
          fontFamily: "Urbanist, sans-serif",
          fontWeight: 600,
          fontSize: 15,
          color: "white",
        }}
      >
        Send Code
      </button>

      {/* Remember Password link */}
      <div className="flex-1 flex items-end justify-center pb-4 mt-8">
        <p style={{ fontFamily: "Urbanist, sans-serif", fontSize: 15, color: "#1e232c" }}>
          <span style={{ fontWeight: 500 }}>Remember Password? </span>
          <Link
            href="/login"
            style={{
              fontWeight: 700,
              color: "#35c2c1",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "Urbanist, sans-serif",
              fontSize: 15,
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
