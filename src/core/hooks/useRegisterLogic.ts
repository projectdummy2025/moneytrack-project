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
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
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

      Cookies.set("moneytrack_session", data.userId, { expires: 7 });
      router.push("/");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    state: { username, email, password, confirmPassword, isLoading },
    actions: { setUsername, setEmail, setPassword, setConfirmPassword, handleRegister }
  };
}
