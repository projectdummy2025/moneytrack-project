"use client";

import React from "react";
import { ReportsView } from "@shell/reports/ReportsView";
import { useReportsCore } from "@core/hooks/ReportsCore";

export default function ReportsPage() {
  // Single hook provides all data for both chart section and transaction list
  const reportData = useReportsCore();

  return (
    <ReportsView
      state={reportData.state}
      actions={reportData.actions}
    />
  );
}
