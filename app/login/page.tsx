"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLoginLogic } from "@core/hooks/useLoginLogic";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { state, actions } = useLoginLogic();
  const [localError, setLocalError] = useState("");

  const handleManualLogin = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (state.isLoading) return;
    setLocalError("");
    
    try {
      await actions.handleLogin();
    } catch (err: any) {
      setLocalError(err.message || "Login failed. Please check your network.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10 max-w-[430px] mx-auto">
      <h1 className="text-[30px] font-bold text-[#1e232c] leading-tight mb-8 mt-10">
        Welcome back! Glad to see you, Again!
      </h1>

      <form method="POST" onSubmit={handleManualLogin} className="flex flex-col gap-4 relative z-10">
        {localError && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
            <AlertCircle size={18} />
            {localError}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          autoComplete="email"
          value={state.email}
          onChange={(e) => actions.setEmail(e.target.value)}
          className="w-full h-[56px] bg-[#f7f8f9] border border-[#e8ecf4] rounded-xl px-5 outline-none focus:border-[#35c2c1] transition-colors font-medium text-[#1e232c]"
        />

        <div className="relative">
          <input
            type={state.showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={state.password}
            onChange={(e) => actions.setPassword(e.target.value)}
            className="w-full h-[56px] bg-[#f7f8f9] border border-[#e8ecf4] rounded-xl px-5 outline-none focus:border-[#35c2c1] transition-colors font-medium text-[#1e232c]"
          />
          <button
            type="button"
            onClick={() => actions.setShowPassword(!state.showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#8391a1]"
          >
            {state.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="flex justify-end">
          <Link href="/forgot-password" title="Forgot Password" className="text-[14px] font-semibold text-[#6a707c] no-underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={state.isLoading}
          className="w-full h-[56px] rounded-xl bg-[#1e232c] text-white font-bold text-[15px] flex items-center justify-center transition-all mt-4 active:scale-95 disabled:opacity-50 relative z-20 shadow-lg shadow-black/10 active:bg-[#2d3441]"
        >
          {state.isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={20} />
              <span>Logging in...</span>
            </div>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <div className="mt-auto pb-6 text-center pt-10">
        <p className="text-[15px] text-[#1e232c]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-[#35c2c1] no-underline">
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}
