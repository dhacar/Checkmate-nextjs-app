import { Document, ObjectId } from "mongodb";
import {
  CreateTodoInput,
  Todo,
  TodoFilters,
  TodoPriority,
  UpdateTodoInput,
} from "../types/todo";
import { getTodoCollection } from "./db";

const priorityRank: Record<TodoPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function hasMongoUri() {
  return Boolean(process.env.MONGODB_URI);
}

function normalizePriority(priority: unknown): TodoPriority {
  if (priority === "high" || priority === "medium" || priority === "low") {
    return priority;
  }

  return "medium";
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function dateToISOString(value: unknown) {
  return value instanceof Date ? value.toISOString() : undefined;
}

function mapTodoDocument(todo: Document): Todo {
  return {
    _id: todo._id.toString(),
    title: typeof todo.title === "string" ? todo.title : "",
    completed: Boolean(todo.completed),
    priority: normalizePriority(todo.priority),
    createdAt: dateToISOString(todo.createdAt) || new Date().toISOString(),
    updatedAt: dateToISOString(todo.updatedAt),
  };
}

export async function fetchTodos(filters: TodoFilters = {}): Promise<Todo[]> {
  try {
    if (!hasMongoUri()) {
      return [];
    }

    const collection = await getTodoCollection();
    const query: Record<string, unknown> = {};

    if (filters.query?.trim()) {
      query.title = { $regex: escapeRegex(filters.query.trim()), $options: "i" };
    }

    if (filters.status === "active") {
      query.completed = false;
    }

    if (filters.status === "completed") {
      query.completed = true;
    }

    if (
      filters.priority &&
      filters.priority !== "all" &&
      ["low", "medium", "high"].includes(filters.priority)
    ) {
      query.priority = filters.priority;
    }

    const todos = await collection
      .find(query)
      .sort({ completed: 1, createdAt: -1 })
      .toArray();

    return todos
      .map(mapTodoDocument)
      .sort((a, b) => {
        if (a.completed !== b.completed) {
          return Number(a.completed) - Number(b.completed);
        }

        return priorityRank[a.priority] - priorityRank[b.priority];
      });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
}

export async function fetchTodoById(id: string): Promise<Todo | null> {
  try {
    if (!hasMongoUri()) {
      return null;
    }

    if (!ObjectId.isValid(id)) {
      return null;
    }

    const collection = await getTodoCollection();
    const todo = await collection.findOne({ _id: new ObjectId(id) });

    if (!todo) {
      return null;
    }

    return mapTodoDocument(todo);
  } catch (error) {
    console.error("Error fetching todo by id:", error);
    return null;
  }
}

export async function createTodo(todo: CreateTodoInput): Promise<string | null> {
  try {
    if (!hasMongoUri()) {
      return null;
    }

    const collection = await getTodoCollection();
    const now = new Date();
    const result = await collection.insertOne({
      title: todo.title,
      completed: todo.completed ?? false,
      priority: todo.priority ?? "medium",
      createdAt: now,
      updatedAt: now,
    });

    return result.insertedId.toString();
  } catch (error) {
    console.error("Error creating todo:", error);
    return null;
  }
}

export async function updateTodo(id: string, todo: UpdateTodoInput): Promise<boolean> {
  try {
    if (!hasMongoUri()) {
      return false;
    }

    if (!ObjectId.isValid(id)) {
      return false;
    }

    const collection = await getTodoCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...todo, updatedAt: new Date() } },
    );

    return result.matchedCount > 0;
  } catch (error) {
    console.error("Error updating todo:", error);
    return false;
  }
}

export async function deleteTodo(id: string): Promise<boolean> {
  try {
    if (!hasMongoUri()) {
      return false;
    }

    if (!ObjectId.isValid(id)) {
      return false;
    }

    const collection = await getTodoCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting todo:", error);
    return false;
  }
}

export async function deleteTodos(ids: string[]): Promise<number> {
  try {
    if (!hasMongoUri()) {
      return 0;
    }

    const objectIds = ids.filter(ObjectId.isValid).map((id) => new ObjectId(id));

    if (objectIds.length === 0) {
      return 0;
    }

    const collection = await getTodoCollection();
    const result = await collection.deleteMany({ _id: { $in: objectIds } });
    return result.deletedCount;
  } catch (error) {
    console.error("Error bulk deleting todos:", error);
    return 0;
  }
}

export async function updateTodos(ids: string[], completed: boolean): Promise<number> {
  try {
    if (!hasMongoUri()) {
      return 0;
    }

    const objectIds = ids.filter(ObjectId.isValid).map((id) => new ObjectId(id));

    if (objectIds.length === 0) {
      return 0;
    }

    const collection = await getTodoCollection();
    const result = await collection.updateMany(
      { _id: { $in: objectIds } },
      { $set: { completed, updatedAt: new Date() } },
    );
    return result.modifiedCount;
  } catch (error) {
    console.error("Error bulk updating todos:", error);
    return 0;
  }
}
