import { Plus } from "lucide-react";
import Link from "next/link";
import { TodoFilters } from "./components/TodoFilters";
import { TodoList } from "./components/TodoList";
import { fetchTodos } from "./lib/todo";
import { TodoFilters as TodoFiltersType, TodoPriority, TodoStatusFilter } from "./types/todo";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams?: Promise<{
    q?: string;
    status?: string;
    priority?: string;
  }>;
};

function parseFilters(params: Awaited<NonNullable<HomeProps["searchParams"]>>): TodoFiltersType {
  const status: TodoStatusFilter =
    params.status === "active" || params.status === "completed" ? params.status : "all";
  const priority: TodoPriority | "all" =
    params.priority === "high" || params.priority === "medium" || params.priority === "low"
      ? params.priority
      : "all";

  return {
    query: params.q ?? "",
    status,
    priority,
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const params = searchParams ? await searchParams : {};
  const filters = parseFilters(params);
  const todos = await fetchTodos(filters);
  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Next.js + MongoDB</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Todo App</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Manage priorities, search your list, filter by status, and update todos in bulk.
          </p>
        </div>

        <Link
          href="/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-200"
        >
          <Plus aria-hidden className="h-4 w-4" />
          Add Todo
        </Link>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Visible</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{todos.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Active</p>
          <p className="mt-1 text-3xl font-bold text-teal-700">{activeCount}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-500">Completed</p>
          <p className="mt-1 text-3xl font-bold text-emerald-700">{completedCount}</p>
        </div>
      </section>

      <TodoFilters filters={filters} />
      <TodoList todos={todos} />
    </main>
  );
}
