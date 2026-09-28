import { db } from "../prisma/db.js";

type CreateTaskInput = {
  title: string;
  description?: string;
  dueDate?: string;
};

export async function createTask(input: CreateTaskInput) {
  const task = await db.orm.public.Task.create({
    userId: null,
    title: input.title,
    description: input.description ?? null,
    dueDate: input.dueDate ?? null,
    status: "pending",
  });

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    status: task.status,
  };
}