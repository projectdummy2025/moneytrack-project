"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSendCode = () => {
    // UI logic only
    router.push("/otp-verification");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10 max-w-[430px] mx-auto">
      {/* Title & Description */}
      <h1 className="text-[30px] font-bold text-[#1e232c] leading-tight mb-3 mt-10">
        Forgot Password?
      </h1>
      <p className="text-[16px] font-medium text-[#8391a1] leading-relaxed mb-8">
        Don&apos;t worry! It occurs. Please enter the email address linked with your account.
      </p>

      {/* Email Input */}
      <div className="mb-6">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-[56px] bg-[#f7f8f9] border border-[#e8ecf4] rounded-xl px-5 outline-none focus:border-[#35c2c1] transition-colors font-medium text-[#1e232c]"
        />
      </div>

      {/* Send Code Button */}
      <button
        onClick={handleSendCode}
        className="w-full h-[56px] bg-[#1e232c] rounded-xl flex items-center justify-center font-semibold text-[15px] text-white hover:bg-[#2d3441] transition-all active:scale-95 shadow-lg shadow-black/10"
      >
        Send Code
      </button>

      {/* Remember Password link */}
      <div className="mt-auto pb-6 text-center pt-10">
        <p className="text-[15px] text-[#1e232c] font-medium">
          Remember Password?{" "}
          <Link
            href="/login"
            className="font-bold text-[#35c2c1] no-underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
