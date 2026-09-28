import { Router } from "express";
import { db } from "../prisma/db.js";

const router = Router();

// =========================
// GET ALL NOTES
// =========================

router.get("/", async (_req, res) => {
  try {
    const notes = await db.orm.public.Note
      .orderBy((note) => note.id.desc())
      .all();

    return res.json({
      success: true,
      notes,
    });
  } catch (error) {
    console.error("Get notes error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
    });
  }
});

// =========================
// CREATE NOTE
// =========================

router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({
        success: false,
        message: "Note title is required",
      });
    }

    if (!content || typeof content !== "string") {
      return res.status(400).json({
        success: false,
        message: "Note content is required",
      });
    }

    const note = await db.orm.public.Note.create({
      userId: null,
      title: title.trim(),
      content: content.trim(),
    });

    return res.status(201).json({
      success: true,
      note,
    });
  } catch (error) {
    console.error("Create note error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create note",
    });
  }
});

// =========================
// DELETE NOTE
// =========================

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
      });
    }

    await db.orm.public.Note
      .where({
        id,
      })
      .deleteAll();

    return res.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete note",
    });
  }
});

export default router;