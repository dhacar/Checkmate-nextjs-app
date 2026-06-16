"use server";

import { redirect } from "next/navigation";
import { TODO_PRIORITIES, TODO_STATUSES } from "../types/todo";

function isKnownStatus(value: string) {
  return TODO_STATUSES.some((status) => status === value);
}

function isKnownPriority(value: string) {
  return value === "all" || TODO_PRIORITIES.some((priority) => priority === value);
}

export async function applyTodoFiltersAction(formData: FormData) {
  const params = new URLSearchParams();
  const query = formData.get("q");
  const status = formData.get("status");
  const priority = formData.get("priority");

  if (typeof query === "string" && query.trim()) {
    params.set("q", query.trim());
  }

  if (typeof status === "string" && isKnownStatus(status) && status !== "all") {
    params.set("status", status);
  }

  if (typeof priority === "string" && isKnownPriority(priority) && priority !== "all") {
    params.set("priority", priority);
  }

  redirect(params.size ? `/?${params.toString()}` : "/");
}
