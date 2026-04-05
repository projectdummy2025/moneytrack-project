"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function useRegisterLogic() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (isLoading) return;

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, name: username }),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      Cookies.set("moneytrack_session", data.userId, { expires: 7, path: '/' });
      router.push("/");
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    state: { username, email, password, confirmPassword, showPassword, showConfirmPassword, isLoading },
    actions: { setUsername, setEmail, setPassword, setConfirmPassword, setShowPassword, setShowConfirmPassword, handleRegister }
  };
}
