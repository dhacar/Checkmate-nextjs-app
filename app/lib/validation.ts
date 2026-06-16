import { TODO_PRIORITIES, TodoPriority } from "../types/todo";

export function validateTitle(title: FormDataEntryValue | null) {
  const value = typeof title === "string" ? title.trim() : "";

  if (!value) {
    return { error: "Title is required.", value };
  }

  if (value.length > 200) {
    return { error: "Title must be 200 characters or fewer.", value };
  }

  return { value };
}

export function validatePriority(priority: FormDataEntryValue | null): TodoPriority {
  if (typeof priority === "string" && TODO_PRIORITIES.includes(priority as TodoPriority)) {
    return priority as TodoPriority;
  }

  return "medium";
}
