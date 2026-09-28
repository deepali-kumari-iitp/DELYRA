import { Router } from "express";
import { db } from "../prisma/db.js";

const router = Router();

// =========================
// GET ALL PROJECTS
// =========================

router.get("/", async (_req, res) => {
  try {
    const projects =
      await db.orm.public.Project
        .orderBy((project) => project.id.desc())
        .all();

    return res.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error(
      "Get projects error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
});

// =========================
// CREATE PROJECT
// =========================

router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
    } = req.body;

    if (
      !name ||
      typeof name !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Project name is required",
      });
    }

    const project =
      await db.orm.public.Project.create({
        userId: null,
        name: name.trim(),
        description:
          description?.trim() || null,
        progress: 0,
      });

    return res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error(
      "Create project error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create project",
    });
  }
});

// =========================
// UPDATE PROJECT
// =========================

router.patch(
  "/:id",
  async (req, res) => {
    try {
      const id = Number(
        req.params.id
      );

      const {
        name,
        description,
        progress,
      } = req.body;

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid project ID",
        });
      }

      const project =
        await db.orm.public.Project
          .where({ id })
          .update({
            ...(name !== undefined && {
              name: String(name).trim(),
            }),

            ...(description !== undefined && {
              description:
                description
                  ? String(
                      description
                    ).trim()
                  : null,
            }),

            ...(progress !== undefined && {
              progress: Number(
                progress
              ),
            }),
          });

      return res.json({
        success: true,
        project,
      });
    } catch (error) {
      console.error(
        "Update project error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update project",
      });
    }
  }
);

// =========================
// DELETE PROJECT
// =========================

router.delete(
  "/:id",
  async (req, res) => {
    try {
      const id = Number(
        req.params.id
      );

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid project ID",
        });
      }

      await db.orm.public.Project
        .where({ id })
        .deleteAll();

      return res.json({
        success: true,
        message:
          "Project deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete project error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete project",
      });
    }
  }
);

export default router;