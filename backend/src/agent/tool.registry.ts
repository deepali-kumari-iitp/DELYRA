import { calculator } from "../tools/calculator.tool.js";
import { webSearch } from "../tools/websearch.tool.js";
import { createTask } from "../tools/task.tool.js";
import { createNote } from "../tools/note.tool.js";

export const toolRegistry = {
  calculator,
  webSearch,
  createTask,
  createNote,
};

export type ToolName = keyof typeof toolRegistry;