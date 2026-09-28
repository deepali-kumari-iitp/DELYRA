import { db } from "../prisma/db.js";

type MemoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function addMemory(message: MemoryMessage) {
  await db.orm.public.Memory.create({
    userId: null,
    role: message.role,
    content: message.content,
  });
}

export async function getMemory(): Promise<MemoryMessage[]> {
  const memories = await db.orm.public.Memory
    .orderBy((memory) => memory.id.desc())
    .all();

  return memories
    .slice(0, 20)
    .reverse()
    .map((memory) => ({
      role:
        memory.role === "user"
          ? "user"
          : "assistant",
      content: memory.content ?? "",
    }));
}

export async function clearMemory() {
  await db.orm.public.Memory
    .where({})
    .deleteAll();
}