export const TODO_PRIORITIES = ["low", "medium", "high"] as const;
export const TODO_STATUSES = ["all", "active", "completed"] as const;

export type TodoPriority = (typeof TODO_PRIORITIES)[number];
export type TodoStatusFilter = (typeof TODO_STATUSES)[number];

export type Todo = {
  _id: string;
  title: string;
  completed: boolean;
  priority: TodoPriority;
  createdAt: string;
  updatedAt?: string;
};

export type CreateTodoInput = {
  title: string;
  completed?: boolean;
  priority?: TodoPriority;
};

export type UpdateTodoInput = {
  title?: string;
  completed?: boolean;
  priority?: TodoPriority;
  updatedAt?: Date;
};

export type TodoFilters = {
  query?: string;
  status?: TodoStatusFilter;
  priority?: TodoPriority | "all";
};

export type TodoFormState = {
  error?: string;
  values?: {
    title?: string;
    priority?: TodoPriority;
  };
};
