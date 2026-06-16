import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Todo not found</h1>
      <p className="mt-2 text-slate-600">That todo may have been deleted or the link is invalid.</p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-200"
      >
        Back to Todos
      </Link>
    </main>
  );
}
