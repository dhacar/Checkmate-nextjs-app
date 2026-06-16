"use client";

import { Save, X } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { Todo, TodoFormState } from "../types/todo";

type TodoFormProps = {
  action: (state: TodoFormState | null, formData: FormData) => Promise<TodoFormState | null>;
  submitLabel: string;
  todo?: Todo;
};

export function TodoForm({ action, submitLabel, todo }: TodoFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const title = state?.values?.title ?? todo?.title ?? "";
  const priority = state?.values?.priority ?? todo?.priority ?? "medium";

  return (
    <form action={formAction} className="space-y-5">
      {todo ? <input type="hidden" name="id" value={todo._id} /> : null}

      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-semibold text-slate-700">
          Todo title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={title}
          placeholder="Enter your todo"
          required
          maxLength={200}
          autoFocus
          className="h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />
        <p className="mt-1 text-xs text-slate-500">Maximum 200 characters</p>
      </div>

      <div>
        <label htmlFor="priority" className="mb-2 block text-sm font-semibold text-slate-700">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          defaultValue={priority}
          className="h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {state?.error ? (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Save aria-hidden className="h-4 w-4" />
          {isPending ? "Saving..." : submitLabel}
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          <X aria-hidden className="h-4 w-4" />
          Cancel
        </Link>
      </div>
    </form>
  );
}
