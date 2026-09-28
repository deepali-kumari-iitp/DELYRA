import { Router } from "express";

import { runAgent } from "../agent/agent.engine.js";
import { askGemini } from "../services/gemini.service.js";

const router = Router();

// =========================
// NORMAL AI CHAT
// =========================

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const result = await runAgent(message);

    return res.json(result);
  } catch (error: any) {
    console.error("========== AGENT ERROR ==========");
    console.error(error);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message:
        error?.message || "Agent request failed",
    });
  }
});

// =========================
// DOCUMENT ANALYSIS
// =========================

router.post(
  "/analyze-document",
  async (req, res) => {
    try {
      const {
        fileName,
        content,
      } = req.body;

      // =========================
      // VALIDATION
      // =========================

      if (
        !fileName ||
        typeof fileName !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "File name is required",
        });
      }

      if (
        !content ||
        typeof content !== "string"
      ) {
        return res.status(400).json({
          success: false,
          message: "Document content is required",
        });
      }

      // =========================
      // LIMIT CONTENT
      // =========================

      const documentContent =
        content.slice(0, 12000);

      // =========================
      // ANALYSIS PROMPT
      // =========================

      const prompt = `
You are DELYRA, an intelligent AI learning assistant.

Analyze the following document.

Document name:
${fileName}

Document content:
${documentContent}

Give the response in this structure:

## Summary

Give a clear and concise summary of the document.

## Important Concepts

Explain the most important concepts from the document.

## Key Points

List the important points that should be remembered.

## Important Terms

List important technical terms and explain them briefly.

## Interview / Revision Questions

Create 3 useful questions based ONLY on the document content.

Keep the explanation easy to understand for a student preparing for software engineering interviews.

Do not invent information that is not present in the document.
`;

      // =========================
      // GEMINI
      // =========================

      const response =
        await askGemini(prompt);

      return res.json({
        success: true,
        fileName,
        response:
          response ||
          "DELYRA could not analyze this document.",
      });
    } catch (error: any) {
      console.error(
        "========== DOCUMENT ANALYSIS ERROR =========="
      );

      console.error(error);

      console.error(
        "============================================="
      );

      return res.status(500).json({
        success: false,
        message:
          error?.message ||
          "Document analysis failed",
      });
    }
  }
);

export default router;