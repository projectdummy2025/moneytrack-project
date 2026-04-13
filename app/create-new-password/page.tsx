"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateNewPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = () => {
    // UI logic only
    router.push("/password-changed");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10 max-w-[430px] mx-auto">
      {/* Title & Description */}
      <h1 className="text-heading-xl font-bold text-[#1e232c] leading-tight mb-3 mt-10">
        Create new password
      </h1>
      <p className="text-body-lg font-medium text-[#8391a1] leading-relaxed mb-8">
        Your new password must be unique from those previously used.
      </p>

      {/* New Password Input */}
      <div className="mb-4">
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full h-[56px] bg-[#f7f8f9] border border-[#e8ecf4] rounded-xl px-5 outline-none focus:border-[#35c2c1] transition-colors font-medium text-[#1e232c]"
        />
      </div>

      {/* Confirm Password Input */}
      <div className="mb-8">
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full h-[56px] bg-[#f7f8f9] border border-[#e8ecf4] rounded-xl px-5 outline-none focus:border-[#35c2c1] transition-colors font-medium text-[#1e232c]"
        />
      </div>

      {/* Reset Password Button */}
      <button
        onClick={handleReset}
        className="w-full h-[56px] bg-[#1e232c] rounded-xl flex items-center justify-center font-semibold text-body text-white hover:bg-[#2d3441] transition-all active:scale-95 shadow-lg shadow-black/10"
      >
        Reset Password
      </button>
    </div>
  );
}
