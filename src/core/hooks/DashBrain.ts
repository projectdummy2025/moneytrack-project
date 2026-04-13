"use client";

import { useDashContext } from "../providers/DashProvider";

export function useDashBrain() {
  return useDashContext();
}
