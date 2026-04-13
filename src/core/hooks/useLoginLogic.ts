"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function useLoginLogic() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const payload = { 
        email: email.trim(), 
        password: password.trim() 
      };

      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Set cookie di client side juga sebagai cadangan
      Cookies.set("moneytrack_session", data.userId, { expires: 7, path: '/' });
      
      // Redirect paksa secara halus
      router.push("/");
    } catch (err) {
      throw err; // Lempar ke UI agar localError muncul
    } finally {
      setIsLoading(false);
    }
  };

  return {
    state: { email, password, showPassword, isLoading },
    actions: { setEmail, setPassword, setShowPassword, handleLogin }
  };
}
