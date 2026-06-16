import { Search } from "lucide-react";
import Link from "next/link";
import { applyTodoFiltersAction } from "../actions/filter";
import { TodoFilters as TodoFiltersType } from "../types/todo";

type TodoFiltersProps = {
  filters: TodoFiltersType;
};

export function TodoFilters({ filters }: TodoFiltersProps) {
  return (
    <form action={applyTodoFiltersAction} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_150px_150px_auto_auto]">
      <label className="relative block">
        <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <span className="sr-only">Search todos</span>
        <input
          name="q"
          defaultValue={filters.query ?? ""}
          placeholder="Search todos"
          className="h-11 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        />
      </label>

      <label className="block">
        <span className="sr-only">Completion status</span>
        <select
          name="status"
          defaultValue={filters.status ?? "all"}
          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </label>

      <label className="block">
        <span className="sr-only">Priority</span>
        <select
          name="priority"
          defaultValue={filters.priority ?? "all"}
          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
        >
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </label>

      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-200"
      >
        Apply
      </button>

      <Link
        href="/"
        className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
      >
        Reset
      </Link>
    </form>
  );
}
