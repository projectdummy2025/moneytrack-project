"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@shell/auth/AuthLayout";
import { BackButton } from "@shell/auth/BackButton";

export default function CreateNewPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = () => {
    // UI logic only
    router.push("/password-changed");
  };

  return (
    <AuthLayout>
      <div className="mt-9">
        <BackButton to="/otp-verification" />
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
        Create new password
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
        Your new password must be unique from those previously used.
      </p>

      {/* New Password Input */}
      <div className="mb-4">
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full h-[56px] bg-[#f7f8f9] border border-[#e8ecf4] rounded-[8px] px-5 outline-none focus:border-[#35c2c1] transition-colors"
          style={{
            fontFamily: "Urbanist, sans-serif",
            fontWeight: 500,
            fontSize: 15,
            color: "#1e232c",
          }}
        />
      </div>

      {/* Confirm Password Input */}
      <div className="mb-8">
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full h-[56px] bg-[#f7f8f9] border border-[#e8ecf4] rounded-[8px] px-5 outline-none focus:border-[#35c2c1] transition-colors"
          style={{
            fontFamily: "Urbanist, sans-serif",
            fontWeight: 500,
            fontSize: 15,
            color: "#1e232c",
          }}
        />
      </div>

      {/* Reset Password Button */}
      <button
        onClick={handleReset}
        className="w-full h-[56px] bg-[#1e232c] rounded-[8px] flex items-center justify-center cursor-pointer hover:bg-[#2d3441] transition-colors"
        style={{
          fontFamily: "Urbanist, sans-serif",
          fontWeight: 600,
          fontSize: 15,
          color: "white",
        }}
      >
        Reset Password
      </button>
    </AuthLayout>
  );
}
