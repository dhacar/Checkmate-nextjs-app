"use server";

import { revalidatePath } from "next/cache";
import { deleteTodo as deleteTodoFromDB } from "../lib/todo";

export async function deleteTodo(id: string) {
  if (!id) {
    return { error: "Todo ID is required." };
  }

  const success = await deleteTodoFromDB(id);

  if (!success) {
    return { error: "Failed to delete todo." };
  }

  revalidatePath("/");
  return { success: true };
}
