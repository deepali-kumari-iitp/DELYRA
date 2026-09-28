import express from "express";
import cors from "cors";

import aiRoutes from "./routes/ai.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import projectsRoutes from "./routes/projects.routes.js";
import calendarRoutes from "./routes/calendar.routes.js";

const app = express();

const PORT = Number(process.env.PORT) || 5000;

// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());

// =========================
// API ROUTES
// =========================

app.use("/api/ai", aiRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/calendar", calendarRoutes);

// =========================
// ROOT ROUTE
// =========================

app.get("/", (_req, res) => {
  res.json({
    message: "DELYRA backend is running ✨",
  });
});

// =========================
// START SERVER
// =========================

app.listen(PORT, "0.0.0.0", () => {
  console.log(`DELYRA backend running on port ${PORT}`);
});