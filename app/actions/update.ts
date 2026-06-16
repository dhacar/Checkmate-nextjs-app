"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fetchTodoById, updateTodo } from "../lib/todo";
import { validatePriority, validateTitle } from "../lib/validation";
import { TodoFormState } from "../types/todo";

export async function updateTodoAction(
  _previousState: TodoFormState | null,
  formData: FormData,
): Promise<TodoFormState | null> {
  const id = formData.get("id");
  const { error, value: title } = validateTitle(formData.get("title"));
  const priority = validatePriority(formData.get("priority"));

  if (typeof id !== "string" || !id) {
    return { error: "Todo ID is required.", values: { title, priority } };
  }

  if (error) {
    return { error, values: { title, priority } };
  }

  const existingTodo = await fetchTodoById(id);

  if (!existingTodo) {
    return { error: "Todo was not found.", values: { title, priority } };
  }

  const success = await updateTodo(id, { title, priority });

  if (!success) {
    return {
      error: "Could not update the todo. Check your MongoDB connection and try again.",
      values: { title, priority },
    };
  }

  revalidatePath("/");
  redirect("/");
}
