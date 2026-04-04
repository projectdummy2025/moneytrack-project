"use client";

import React from "react";
import { EntryGate } from "@shell/auth/EntryGate";
import { useAuthLogic } from "@core/hooks/AuthVault";

export default function LoginPage() {
  const brain = useAuthLogic();

  return (
    <EntryGate 
      state={brain.state} 
      actions={brain.actions} 
    />
  );
}
