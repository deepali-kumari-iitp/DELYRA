import { db } from "../prisma/db.js";

type CreateNoteInput = {
  title: string;
  content: string;
};

export async function createNote(input: CreateNoteInput) {
  const note = await db.orm.public.Note.create({
    userId: null,
    title: input.title,
    content: input.content,
  });

  return {
    id: note.id,
    title: note.title,
    content: note.content,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}