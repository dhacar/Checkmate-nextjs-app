"use client";

import { Check, CheckCheck, Edit3, Square, Trash2, X } from "lucide-react";
import Link from "next/link";
import { startTransition, useMemo, useState, useTransition } from "react";
import { bulkDeleteTodos, bulkSetTodosCompleted } from "../actions/bulk";
import { deleteTodo } from "../actions/delete";
import { toggleTodo } from "../actions/toggle";
import { Todo, TodoPriority } from "../types/todo";
import { RelativeTime } from "./RelativeTime";

const priorityStyles: Record<TodoPriority, string> = {
  high: "border-red-200 bg-red-50 text-red-700",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

type TodoListProps = {
  todos: Todo[];
};

export function TodoList({ todos }: TodoListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startServerTransition] = useTransition();

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allSelected = todos.length > 0 && selectedIds.length === todos.length;

  function toggleSelection(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id],
    );
  }

  function selectAll() {
    setSelectedIds(allSelected ? [] : todos.map((todo) => todo._id));
  }

  function runAction(action: () => Promise<{ error?: string; success?: boolean } | unknown>) {
    setMessage(null);
    startServerTransition(async () => {
      const result = await action();
      if (result && typeof result === "object" && "error" in result && result.error) {
        setMessage(String(result.error));
      }
    });
  }

  function runBulk(completed?: boolean) {
    const ids = selectedIds.length > 0 ? selectedIds : todos.map((todo) => todo._id);

    if (ids.length === 0) {
      return;
    }

    setMessage(null);
    startTransition(() => {
      setSelectedIds([]);
    });

    startServerTransition(async () => {
      if (typeof completed === "boolean") {
        const result = await bulkSetTodosCompleted(ids, completed);
        setMessage(`Updated ${result.updatedCount} todo${result.updatedCount === 1 ? "" : "s"}.`);
        return;
      }

      const result = await bulkDeleteTodos(ids);
      setMessage(`Deleted ${result.deletedCount} todo${result.deletedCount === 1 ? "" : "s"}.`);
    });
  }

  if (todos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <p className="text-lg font-semibold text-slate-700">No todos found</p>
        <p className="mt-2 text-sm text-slate-500">Create a todo or change your filters.</p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={selectAll}
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
            aria-label={allSelected ? "Clear selected todos" : "Select all todos"}
            title={allSelected ? "Clear selection" : "Select all"}
          >
            {allSelected ? <CheckCheck aria-hidden className="h-4 w-4" /> : <Square aria-hidden className="h-4 w-4" />}
          </button>
          <span className="text-sm font-medium text-slate-600">
            {selectedIds.length > 0 ? `${selectedIds.length} selected` : `${todos.length} visible`}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <button
            type="button"
            disabled={isPending}
            onClick={() => runBulk(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-emerald-700 px-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <CheckCheck aria-hidden className="h-4 w-4" />
            Complete
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => runBulk(false)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-700 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <X aria-hidden className="h-4 w-4" />
            Reopen
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => runBulk()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-red-700 px-3 text-sm font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Trash2 aria-hidden className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {message ? (
        <p className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">{message}</p>
      ) : null}

      <div className="space-y-3">
        {todos.map((todo) => (
          <article
            key={todo._id}
            className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[auto_1fr_auto]"
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedSet.has(todo._id)}
                onChange={() => toggleSelection(todo._id)}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                aria-label={`Select ${todo.title}`}
              />

              <button
                type="button"
                disabled={isPending}
                onClick={() => runAction(() => toggleTodo(todo._id))}
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition focus:outline-none focus:ring-2 focus:ring-teal-200 ${
                  todo.completed
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-300 bg-white text-slate-500 hover:bg-slate-50"
                }`}
                title={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                aria-label={todo.completed ? "Mark todo as incomplete" : "Mark todo as complete"}
              >
                {todo.completed ? <Check aria-hidden className="h-4 w-4" /> : <Square aria-hidden className="h-4 w-4" />}
              </button>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className={`break-words text-base font-semibold ${todo.completed ? "text-slate-400 line-through" : "text-slate-800"}`}>
                  {todo.title}
                </h2>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${priorityStyles[todo.priority]}`}>
                  {todo.priority}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <RelativeTime value={todo.createdAt} prefix="Created " />
                {todo.updatedAt ? <RelativeTime value={todo.updatedAt} prefix="Updated " /> : null}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:justify-end">
              <Link
                href={`/edit/${todo._id}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
                title="Edit todo"
                aria-label="Edit todo"
              >
                <Edit3 aria-hidden className="h-4 w-4" />
              </Link>
              <button
                type="button"
                disabled={isPending}
                onClick={() => runAction(() => deleteTodo(todo._id))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-200 text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-70"
                title="Delete todo"
                aria-label="Delete todo"
              >
                <Trash2 aria-hidden className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
