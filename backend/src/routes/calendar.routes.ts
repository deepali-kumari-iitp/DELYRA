import { Router } from "express";
import { db } from "../prisma/db.js";

const router = Router();

// =========================
// GET ALL CALENDAR EVENTS
// =========================

router.get("/", async (_req, res) => {
  try {
    const events =
      await db.orm.public.CalendarEvent
        .orderBy((event) => event.id.desc())
        .all();

    return res.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error(
      "Get calendar events error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch calendar events",
    });
  }
});

// =========================
// CREATE CALENDAR EVENT
// =========================

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
    } = req.body;

    if (
      !title ||
      typeof title !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Event title is required",
      });
    }

    if (
      !date ||
      typeof date !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Event date is required",
      });
    }

    if (
      !time ||
      typeof time !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Event time is required",
      });
    }

    const event =
      await db.orm.public.CalendarEvent.create({
        userId: null,
        title: title.trim(),
        description:
          description?.trim() || null,
        date: date.trim(),
        time: time.trim(),
      });

    return res.status(201).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error(
      "Create calendar event error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create calendar event",
    });
  }
});

// =========================
// DELETE CALENDAR EVENT
// =========================

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    await db.orm.public.CalendarEvent
      .where({ id })
      .deleteAll();

    return res.json({
      success: true,
      message:
        "Calendar event deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete calendar event error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete calendar event",
    });
  }
});

export default router;