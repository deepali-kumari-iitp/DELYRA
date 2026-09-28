import { ToolName } from "./tool.registry.js";

export function selectTool(
  message: string
): ToolName | null {
  const lowerMessage = message.toLowerCase().trim();

  // =========================
  // TASK MANAGER
  // =========================

  if (
    lowerMessage.includes("create a task") ||
    lowerMessage.includes("create task") ||
    lowerMessage.includes("add a task") ||
    lowerMessage.includes("add task") ||
    lowerMessage.includes("make a task") ||
    lowerMessage.includes("new task") ||
    lowerMessage.includes("remind me to") ||
    lowerMessage.includes("i need to") ||
    lowerMessage.includes("i have to") ||
    lowerMessage.includes("task for") ||
    lowerMessage.includes("todo") ||
    lowerMessage.includes("to-do") ||
    lowerMessage.startsWith("task:")
  ) {
    return "createTask";
  }

  // =========================
  // NOTES
  // =========================

  if (
    lowerMessage.includes("create a note") ||
    lowerMessage.includes("create note") ||
    lowerMessage.includes("add a note") ||
    lowerMessage.includes("add note") ||
    lowerMessage.includes("make a note") ||
    lowerMessage.includes("save a note") ||
    lowerMessage.includes("save this as a note") ||
    lowerMessage.includes("take a note") ||
    lowerMessage.includes("write a note") ||
    lowerMessage.includes("remember this") ||
    lowerMessage.includes("save this")
  ) {
    return "createNote";
  }

  // =========================
  // WEB SEARCH
  // =========================

  if (
    lowerMessage.includes("latest") ||
    lowerMessage.includes("current") ||
    lowerMessage.includes("today") ||
    lowerMessage.includes("news") ||
    lowerMessage.includes("recent") ||
    lowerMessage.includes("search the web") ||
    lowerMessage.includes("search online") ||
    lowerMessage.includes("look up") ||
    lowerMessage.includes("find online") ||
    lowerMessage.includes("search for") ||
    lowerMessage.includes("what is happening") ||
    lowerMessage.includes("what's happening") ||
    lowerMessage.includes("what happened") ||
    lowerMessage.includes("who is") ||
    lowerMessage.includes("what is the latest")
  ) {
    return "webSearch";
  }

  // =========================
  // CALCULATOR
  // =========================

  const hasMathExpression =
    /[0-9]+(?:\s*(?:[+\-*/×÷])\s*[0-9]+)+/.test(
      message
    );

  if (
    hasMathExpression ||
    lowerMessage.includes("calculate") ||
    lowerMessage.includes("multiply") ||
    lowerMessage.includes("divide") ||
    lowerMessage.includes("subtract")
  ) {
    return "calculator";
  }

  // =========================
  // NO TOOL
  // =========================

  return null;
}