import { askGemini } from "../services/gemini.service.js";
import { toolRegistry } from "./tool.registry.js";
import { selectTool } from "./tool.selector.js";
import { addMemory, getMemory } from "./memory.js";

export async function runAgent(message: string) {
  // =========================
  // 1. SAVE USER MESSAGE
  // =========================

  await addMemory({
    role: "user",
    content: message,
  });

  // =========================
  // 2. SELECT TOOL
  // =========================

  const selectedTool = selectTool(message);

  // ==================================================
  // 3. CALCULATOR
  // No Gemini call required
  // ==================================================

  if (selectedTool === "calculator") {
    const expressionMatch = message.match(
      /[0-9]+(?:\s*(?:[+\-*/×÷])\s*[0-9]+)+/
    );

    if (!expressionMatch) {
      const response =
        "I couldn't find a mathematical expression to calculate.";

      await addMemory({
        role: "assistant",
        content: response,
      });

      return {
        success: false,
        plan: {
          goal: "Perform a calculation",
          steps: [
            "Identify mathematical expression",
            "Use calculator tool",
          ],
        },
        selectedTool,
        response,
      };
    }

    try {
      const expression = expressionMatch[0]
        .replace(/×/g, "*")
        .replace(/÷/g, "/");

      const result = toolRegistry.calculator(expression);

      const response = `The answer is **${result}**.`;

      await addMemory({
        role: "assistant",
        content: response,
      });

      return {
        success: true,
        plan: {
          goal: "Perform a calculation",
          steps: [
            "Identify mathematical expression",
            "Select calculator tool",
            "Calculate the result",
            "Return the answer",
          ],
        },
        selectedTool,
        response,
      };
    } catch {
      const response =
        "I couldn't calculate that expression.";

      await addMemory({
        role: "assistant",
        content: response,
      });

      return {
        success: false,
        selectedTool,
        response,
      };
    }
  }

  // ==================================================
  // 4. WEB SEARCH
  // No Gemini call required
  // ==================================================

  if (selectedTool === "webSearch") {
    try {
      const result =
        await toolRegistry.webSearch(message);

      const response =
        result.answer || "No useful search result found.";

      await addMemory({
        role: "assistant",
        content: response,
      });

      return {
        success: true,
        plan: {
          goal: "Find current information from the web",
          steps: [
            "Understand the request",
            "Select web search tool",
            "Search the web using Tavily",
            "Return the search result",
          ],
        },
        selectedTool,
        response,
      };
    } catch (error) {
      console.error("Web search failed:", error);

      const response =
        "I couldn't search the web right now. Please try again later.";

      await addMemory({
        role: "assistant",
        content: response,
      });

      return {
        success: false,
        selectedTool,
        response,
      };
    }
  }

  // ==================================================
  // 5. CREATE TASK
  // No Gemini call required
  // ==================================================

  if (selectedTool === "createTask") {
    try {
      const taskMessage = message
        .replace(/create a task/gi, "")
        .replace(/create task/gi, "")
        .replace(/add a task/gi, "")
        .replace(/add task/gi, "")
        .replace(/make a task/gi, "")
        .replace(/new task/gi, "")
        .replace(/remind me to/gi, "")
        .trim();

      if (!taskMessage) {
        const response =
          "Please tell me what task you want me to create.";

        await addMemory({
          role: "assistant",
          content: response,
        });

        return {
          success: false,
          selectedTool,
          response,
        };
      }

      const task = await toolRegistry.createTask({
        title: taskMessage,
      });

      const response =
        `Task created successfully: **${task.title}**`;

      await addMemory({
        role: "assistant",
        content: response,
      });

      return {
        success: true,
        plan: {
          goal: "Create a task",
          steps: [
            "Understand the task request",
            "Select task manager tool",
            "Create task in the database",
            "Confirm task creation",
          ],
        },
        selectedTool,
        response,
      };
    } catch (error) {
      console.error("Task creation failed:", error);

      const response =
        "I couldn't create the task right now.";

      await addMemory({
        role: "assistant",
        content: response,
      });

      return {
        success: false,
        selectedTool,
        response,
      };
    }
  }

  // ==================================================
  // 6. CREATE NOTE
  // No Gemini call required
  // ==================================================

  if (selectedTool === "createNote") {
    try {
      const noteContent = message
        .replace(/create a note/gi, "")
        .replace(/create note/gi, "")
        .replace(/add a note/gi, "")
        .replace(/add note/gi, "")
        .replace(/make a note/gi, "")
        .replace(/save a note/gi, "")
        .replace(/save this as a note/gi, "")
        .replace(/take a note/gi, "")
        .replace(/write a note/gi, "")
        .trim();

      if (!noteContent) {
        const response =
          "Please tell me what you want me to save as a note.";

        await addMemory({
          role: "assistant",
          content: response,
        });

        return {
          success: false,
          selectedTool,
          response,
        };
      }

      const note = await toolRegistry.createNote({
        title: "DELYRA Note",
        content: noteContent,
      });

      const response =
        `Note saved successfully: **${note.content}**`;

      await addMemory({
        role: "assistant",
        content: response,
      });

      return {
        success: true,
        plan: {
          goal: "Create a note",
          steps: [
            "Understand the note request",
            "Select notes tool",
            "Save the note in the database",
            "Confirm note creation",
          ],
        },
        selectedTool,
        response,
      };
    } catch (error) {
      console.error("Note creation failed:", error);

      const response =
        "I couldn't save the note right now.";

      await addMemory({
        role: "assistant",
        content: response,
      });

      return {
        success: false,
        selectedTool,
        response,
      };
    }
  }

  // ==================================================
  // 7. NORMAL AI REQUEST
  // Gemini is used only when no tool is required
  // ==================================================

  const memory = await getMemory();

  const planningPrompt = `
You are DELYRA, an intelligent AI agent.

Analyze the user's request and create a simple execution plan.

Return ONLY valid JSON:

{
  "goal": "short description",
  "steps": [
    "step 1",
    "step 2",
    "step 3"
  ]
}

User request:
${message}

Conversation memory:
${JSON.stringify(memory)}
`;

  const planResponse =
    await askGemini(planningPrompt);

  let plan;

  try {
    plan = JSON.parse(planResponse ?? "");
  } catch {
    plan = {
      goal: message,
      steps: [
        "Understand the request",
        "Generate a helpful response",
      ],
    };
  }

  // ==================================================
  // 8. FINAL AI RESPONSE
  // ==================================================

  const responsePrompt = `
You are DELYRA, an intelligent AI agent.

User request:
${message}

Conversation memory:
${JSON.stringify(memory)}

Execution plan:
${JSON.stringify(plan)}

Provide a clear and helpful response.

Do not mention internal planning unless useful.
`;

  const response =
    await askGemini(responsePrompt);

  await addMemory({
    role: "assistant",
    content: response ?? "",
  });

  return {
    success: true,
    plan,
    selectedTool: null,
    response:
      response ??
      "I couldn't generate a response.",
  };
}