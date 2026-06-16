"use server";

import { revalidatePath } from "next/cache";
import { fetchTodoById, updateTodo } from "../lib/todo";

export async function toggleTodo(id: string) {
  const todo = await fetchTodoById(id);

  if (!todo) {
    return { error: "Todo was not found." };
  }

  const success = await updateTodo(id, { completed: !todo.completed });

  if (!success) {
    return { error: "Failed to update todo." };
  }

  revalidatePath("/");
  return { success: true };
}
