"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRegisterLogic } from "@core/hooks/useRegisterLogic";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const { state, actions } = useRegisterLogic();
  const [localError, setLocalError] = useState("");

  const handleRegisterAction = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (state.isLoading) return;
    setLocalError("");

    try {
      await actions.handleRegister();
    } catch (err) {
      const error = err as Error;
      setLocalError(error.message || "Registration failed. Please check your network.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 py-10 max-w-[430px] mx-auto overflow-x-hidden">
      <h1 className="text-heading-xl text-[#1e232c] leading-tight mb-8 mt-10">
        Hello! Register to get started
      </h1>

      <div className="flex flex-col gap-4 relative z-10 w-full">
        {localError && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium">
            <AlertCircle size={18} />
            {localError}
          </div>
        )}

        <input
          name="username"
          placeholder="Username"
          autoComplete="username"
          value={state.username}
          onChange={(e) => actions.setUsername(e.target.value)}
          className="w-full h-[56px] bg-[#f7f8f9] border border-[#e8ecf4] rounded-xl px-5 outline-none focus:border-[#35c2c1] transition-colors font-medium text-[#1e232c] relative z-10"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          value={state.email}
          onChange={(e) => actions.setEmail(e.target.value)}
          className="w-full h-[56px] bg-[#f7f8f9] border border-[#e8ecf4] rounded-xl px-5 outline-none focus:border-[#35c2c1] transition-colors font-medium text-[#1e232c] relative z-10"
        />

        <div className="relative w-full">
          <input
            type={state.showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            value={state.password}
            onChange={(e) => actions.setPassword(e.target.value)}
            className="w-full h-[56px] bg-[#f7f8f9] border border-[#e8ecf4] rounded-xl px-5 pr-14 outline-none focus:border-[#35c2c1] transition-colors font-medium text-[#1e232c] relative z-10"
          />
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); actions.setShowPassword(!state.showPassword); }}
            onPointerDown={(e) => { e.preventDefault(); actions.setShowPassword(!state.showPassword); }}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-[#8391a1] hover:text-[#1e232c] z-50 transition-colors"
          >
            {state.showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>

        <div className="relative w-full">
          <input
            type={state.showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm password"
            autoComplete="new-password"
            value={state.confirmPassword}
            onChange={(e) => actions.setConfirmPassword(e.target.value)}
            className="w-full h-[56px] bg-[#f7f8f9] border border-[#e8ecf4] rounded-xl px-5 pr-14 outline-none focus:border-[#35c2c1] transition-colors font-medium text-[#1e232c] relative z-10"
          />
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); actions.setShowConfirmPassword(!state.showConfirmPassword); }}
            onPointerDown={(e) => { e.preventDefault(); actions.setShowConfirmPassword(!state.showConfirmPassword); }}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-[#8391a1] hover:text-[#1e232c] z-50 transition-colors"
          >
            {state.showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>

        <button
          type="button"
          onClick={handleRegisterAction}
          disabled={state.isLoading}
          className="w-full h-[56px] rounded-xl bg-[#1e232c] text-white font-bold text-body transition-all mt-4 shadow-lg shadow-black/10 active:bg-[#2d3441] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center relative z-50"
        >
          {state.isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" size={20} />
              <span>Registering...</span>
            </div>
          ) : (
            "Register"
          )}
        </button>
      </div>

      <div className="mt-auto pb-6 text-center pt-10">
        <p className="text-body text-[#1e232c]">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#35c2c1] no-underline">
            Login Now
          </Link>
        </p>
      </div>
    </div>
  );
}
