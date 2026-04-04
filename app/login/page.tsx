"use client";

import React from "react";
import Link from "next/link";
import { AuthLayout } from "@shell/auth/AuthLayout";
import { SocialButtons } from "@shell/auth/SocialButtons";
import { EyeIcon } from "@shell/auth/EyeIcon";
import { useLoginLogic } from "@core/hooks/useLoginLogic";

export default function LoginPage() {
  const { state, actions } = useLoginLogic();

  return (
    <AuthLayout>
      {/* Title */}
      <h1
        style={{
          fontFamily: "Urbanist, sans-serif",
          fontWeight: 700,
          fontSize: 30,
          color: "#1e232c",
          lineHeight: 1.3,
          letterSpacing: -0.3,
          marginBottom: 32,
          marginTop: 36,
        }}
      >
        Welcome back! Glad to see you, Again!
      </h1>

      {/* Email Input */}
      <div className="mb-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={state.email}
          onChange={(e) => actions.setEmail(e.target.value)}
          className="w-full h-[56px] bg-[#f7f8f9] border border-[#e8ecf4] rounded-[8px] px-5 outline-none focus:border-[#35c2c1] transition-colors"
          style={{
            fontFamily: "Urbanist, sans-serif",
            fontWeight: 500,
            fontSize: 15,
            color: "#1e232c",
          }}
          required
        />
      </div>

      {/* Password Input */}
      <div className="mb-3 relative">
        <input
          type={state.showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={state.password}
          onChange={(e) => actions.setPassword(e.target.value)}
          className="w-full h-[56px] bg-[#f7f8f9] border border-[#e8ecf4] rounded-[8px] px-5 pr-12 outline-none focus:border-[#35c2c1] transition-colors"
          style={{
            fontFamily: "Urbanist, sans-serif",
            fontWeight: 500,
            fontSize: 15,
            color: "#1e232c",
          }}
          required
        />
        <button
          type="button"
          onClick={() => actions.setShowPassword(!state.showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
          aria-label="Toggle password visibility"
        >
          <EyeIcon open={state.showPassword} />
        </button>
      </div>

      {/* Forgot Password */}
      <div className="flex justify-end mb-6">
        <Link
          href="/forgot-password"
          style={{
            fontFamily: "Urbanist, sans-serif",
            fontWeight: 600,
            fontSize: 14,
            color: "#6a707c",
            background: "none",
            border: "none",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          Forgot Password?
        </Link>
      </div>

      {/* Login Button */}
      <button
        onClick={actions.handleLogin as any}
        disabled={state.isLoading}
        className="w-full h-[56px] bg-[#1e232c] rounded-[8px] flex items-center justify-center cursor-pointer hover:bg-[#2d3441] transition-colors disabled:opacity-50"
        style={{
          fontFamily: "Urbanist, sans-serif",
          fontWeight: 600,
          fontSize: 15,
          color: "white",
        }}
      >
        {state.isLoading ? "Logging in..." : "Login"}
      </button>

      {/* Social Buttons */}
      <SocialButtons label="Login" />

      {/* Register link */}
      <div className="flex-1 flex items-end justify-center pb-4 mt-8">
        <p style={{ fontFamily: "Urbanist, sans-serif", fontSize: 15, color: "#1e232c" }}>
          <span style={{ fontWeight: 500 }}>Don&apos;t have an account? </span>
          <Link
            href="/register"
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
            Register Now
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
