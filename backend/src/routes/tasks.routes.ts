import { Router } from "express";
import { db } from "../prisma/db.js";

const router = Router();

// =========================
// GET ALL TASKS
// =========================

router.get("/", async (_req, res) => {
  try {
    const tasks = await db.orm.public.Task
      .orderBy((task) => task.id.desc())
      .all();

    return res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
});

// =========================
// CREATE TASK
// =========================

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      projectId,
    } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    let parsedProjectId: number | null = null;

    if (
      projectId !== undefined &&
      projectId !== null &&
      projectId !== ""
    ) {
      parsedProjectId = Number(projectId);

      if (!Number.isInteger(parsedProjectId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID",
        });
      }
    }

    const task = await db.orm.public.Task.create({
      userId: null,
      projectId: parsedProjectId,
      title: title.trim(),
      description: description ?? null,
      dueDate: dueDate ?? null,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
});

// =========================
// UPDATE TASK STATUS
// =========================

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    if (!status || typeof status !== "string") {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const task = await db.orm.public.Task
      .where({
        id,
      })
      .update({
        status,
      });

    return res.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
});

// =========================
// DELETE TASK
// =========================

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    await db.orm.public.Task
      .where({
        id,
      })
      .deleteAll();

    return res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
});

export default router;