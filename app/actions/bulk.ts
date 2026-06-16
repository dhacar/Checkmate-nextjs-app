"use server";

import { revalidatePath } from "next/cache";
import { deleteTodos, updateTodos } from "../lib/todo";

export async function bulkDeleteTodos(ids: string[]) {
  const deletedCount = await deleteTodos(ids);
  revalidatePath("/");
  return { deletedCount };
}

export async function bulkSetTodosCompleted(ids: string[], completed: boolean) {
  const updatedCount = await updateTodos(ids, completed);
  revalidatePath("/");
  return { updatedCount };
}
