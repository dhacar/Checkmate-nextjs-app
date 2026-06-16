"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createTodo } from "../lib/todo";
import { validatePriority, validateTitle } from "../lib/validation";
import { TodoFormState } from "../types/todo";

export async function createTodoAction(
  _previousState: TodoFormState | null,
  formData: FormData,
): Promise<TodoFormState | null> {
  const { error, value: title } = validateTitle(formData.get("title"));
  const priority = validatePriority(formData.get("priority"));

  if (error) {
    return { error, values: { title, priority } };
  }

  const todoId = await createTodo({ title, priority });

  if (!todoId) {
    return {
      error: "Could not create the todo. Check your MongoDB connection and try again.",
      values: { title, priority },
    };
  }

  revalidatePath("/");
  redirect("/");
}
