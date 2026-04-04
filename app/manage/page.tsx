"use client";

import React from "react";
import { StatusHub } from "@shell/manage/StatusHub";
import { useManageCore } from "@core/hooks/ManageCore";

export default function ManagePage() {
  const brain = useManageCore();

  return (
    <StatusHub 
      state={brain.state} 
      actions={brain.actions} 
    />
  );
}
