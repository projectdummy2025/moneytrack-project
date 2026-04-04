"use client";

import React from "react";
import Link from "next/link";
import { AuthLayout } from "@shell/auth/AuthLayout";
import { SocialButtons } from "@shell/auth/SocialButtons";
import { useRegisterLogic } from "@core/hooks/useRegisterLogic";

export default function RegisterPage() {
  const { state, actions } = useRegisterLogic();

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
        Hello! Register to get started
      </h1>

      {/* Username Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Username"
          value={state.username}
          onChange={(e) => actions.setUsername(e.target.value)}
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

      {/* Email Input */}
      <div className="mb-4">
        <input
          type="email"
          placeholder="Email"
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
      <div className="mb-4">
        <input
          type="password"
          placeholder="Password"
          value={state.password}
          onChange={(e) => actions.setPassword(e.target.value)}
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

      {/* Confirm Password Input */}
      <div className="mb-6">
        <input
          type="password"
          placeholder="Confirm password"
          value={state.confirmPassword}
          onChange={(e) => actions.setConfirmPassword(e.target.value)}
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

      {/* Register Button */}
      <button
        onClick={actions.handleRegister as any}
        disabled={state.isLoading}
        className="w-full h-[56px] bg-[#1e232c] rounded-[8px] flex items-center justify-center cursor-pointer hover:bg-[#2d3441] transition-colors disabled:opacity-50"
        style={{
          fontFamily: "Urbanist, sans-serif",
          fontWeight: 600,
          fontSize: 15,
          color: "white",
        }}
      >
        {state.isLoading ? "Registering..." : "Register"}
      </button>

      {/* Social Buttons */}
      <SocialButtons label="Register" />

      {/* Login link */}
      <div className="flex-1 flex items-end justify-center pb-4 mt-8">
        <p style={{ fontFamily: "Urbanist, sans-serif", fontSize: 15, color: "#1e232c" }}>
          <span style={{ fontWeight: 500 }}>Already have an account? </span>
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
            Login Now
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
