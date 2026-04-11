"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function useProfile() {
  const [user, setUser] = useState<{ name: string; email: string; image: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  return { user, isLoading };
}

export function useAuthVault() {
  const router = useRouter();

  const setSession = (userId: string) => {
    Cookies.set("moneytrack_session", userId, { expires: 7 });
    router.push("/");
  };

  const clearSession = () => {
    Cookies.remove("moneytrack_session");
    router.push("/login");
  };

  return {
    actions: { setSession, clearSession }
  };
}

export function useAuthLogic() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { actions } = useAuthVault();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      actions.setSession(data.userId);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    state: { mode, email, password, name, isLoading },
    actions: { setMode, setEmail, setPassword, setName, handleSubmit }
  };
}
