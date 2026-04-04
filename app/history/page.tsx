"use client";

import React from "react";
import { TraceLine } from "@shell/history/TraceLine";
import { useHistoryCore } from "@core/hooks/HistoryCore";

export default function HistoryPage() {
  const brain = useHistoryCore();

  return (
    <TraceLine 
      state={brain.state} 
      actions={brain.actions} 
    />
  );
}
