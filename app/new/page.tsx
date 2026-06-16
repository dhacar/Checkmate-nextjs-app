import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createTodoAction } from "../actions/create";
import { TodoForm } from "../components/TodoForm";

export default function NewTodoPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-4 py-8 sm:px-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Add Todo</h1>
            <p className="mt-1 text-sm text-slate-600">Create a task with a priority level.</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-900"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            Back
          </Link>
        </div>

        <TodoForm action={createTodoAction} submitLabel="Create Todo" />
      </div>
    </main>
  );
}
