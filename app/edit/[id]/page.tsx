import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateTodoAction } from "../../actions/update";
import { RelativeTime } from "../../components/RelativeTime";
import { TodoForm } from "../../components/TodoForm";
import { fetchTodoById } from "../../lib/todo";

export const dynamic = "force-dynamic";

type EditTodoPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTodoPage({ params }: EditTodoPageProps) {
  const { id } = await params;
  const todo = await fetchTodoById(id);

  if (!todo) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-4 py-8 sm:px-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Todo</h1>
            <p className="mt-1 text-sm text-slate-600">
              <RelativeTime value={todo.createdAt} prefix="Created " />
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-900"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
            Back
          </Link>
        </div>

        <TodoForm action={updateTodoAction} submitLabel="Update Todo" todo={todo} />
      </div>
    </main>
  );
}
