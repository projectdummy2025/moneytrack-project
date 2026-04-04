"use client";

import React from "react";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight, Loader2, TrendingUp } from "lucide-react";
import { cn } from "@core/utils/HelperTool";

interface EntryGateProps {
  state: {
    mode: "login" | "register";
    email: string;
    password: string;
    name: string;
    isLoading: boolean;
  };
  actions: {
    setMode: (mode: "login" | "register") => void;
    setEmail: (val: string) => void;
    setPassword: (val: string) => void;
    setName: (val: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
  };
}

export function EntryGate({ state, actions }: EntryGateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center gap-4 mb-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/40 mb-2">
            <TrendingUp className="w-8 h-8 stroke-[3px]" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter">MONEYTRACK</h1>
          <p className="text-muted-foreground font-medium">Control your wealth, track your future.</p>
        </div>

        <div className="bg-card border border-border/50 rounded-[3rem] p-10 shadow-xl shadow-primary/5 backdrop-blur-sm">
          {/* Tab Switcher */}
          <div className="flex p-1 bg-muted rounded-2xl mb-8 border border-border/50">
            <button
              onClick={() => actions.setMode("login")}
              className={cn(
                "flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                state.mode === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              <LogIn className="w-4 h-4" /> Login
            </button>
            <button
              onClick={() => actions.setMode("register")}
              className={cn(
                "flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                state.mode === "register" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              <UserPlus className="w-4 h-4" /> Register
            </button>
          </div>

          <form onSubmit={actions.handleSubmit} className="flex flex-col gap-5">
            {state.mode === "register" && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-4">Full Name</label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Alex Doe" 
                    value={state.name}
                    onChange={(e) => actions.setName(e.target.value)}
                    required
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-muted border-none focus:ring-4 focus:ring-primary/10 transition-all font-bold outline-none"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  value={state.email}
                  onChange={(e) => actions.setEmail(e.target.value)}
                  required
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-muted border-none focus:ring-4 focus:ring-primary/10 transition-all font-bold outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-4">Secret Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={state.password}
                  onChange={(e) => actions.setPassword(e.target.value)}
                  required
                  className="w-full pl-14 pr-6 py-4 rounded-2xl bg-muted border-none focus:ring-4 focus:ring-primary/10 transition-all font-bold outline-none"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={state.isLoading}
              className="w-full mt-6 py-5 rounded-3xl bg-primary text-white text-lg font-black tracking-tight shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {state.isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  {state.mode === "login" ? "Get Started" : "Create Account"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
