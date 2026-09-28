import { useEffect, useState } from "react";
import {
  Check,
  Circle,
  Clock3,
  Trash2,
  Plus,
  RefreshCw,
} from "lucide-react";

type Task = {
  id: number;
  projectId: number | null;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: string;
  createdAt: string;
  userId: string | null;
};

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH TASKS
  // =========================

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/tasks"
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch tasks"
        );
      }

      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Fetch tasks error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD ON PAGE OPEN
  // =========================

  useEffect(() => {
    fetchTasks();
  }, []);

  // =========================
  // UPDATE PROJECT PROGRESS
  // =========================

  const updateProjectProgress = async (
    projectId: number | null
  ) => {
    if (projectId === null) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/tasks"
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        return;
      }

      const projectTasks: Task[] =
        data.tasks.filter(
          (item: Task) =>
            item.projectId === projectId
        );

      const total = projectTasks.length;

      const completed =
        projectTasks.filter(
          (item: Task) =>
            item.status === "completed"
        ).length;

      const progress =
        total === 0
          ? 0
          : Math.round(
              (completed / total) * 100
            );

      await fetch(
        `http://localhost:5000/api/projects/${projectId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            progress,
          }),
        }
      );
    } catch (error) {
      console.error(
        "Project progress update error:",
        error
      );
    }
  };

  // =========================
  // TOGGLE TASK STATUS
  // =========================

  const toggleTask = async (task: Task) => {
    try {
      setError("");

      const newStatus =
        task.status === "completed"
          ? "pending"
          : "completed";

      const response = await fetch(
        `http://localhost:5000/api/tasks/${task.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update task"
        );
      }

      setTasks((prev) =>
        prev.map((item) =>
          item.id === task.id
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );

      await updateProjectProgress(
        task.projectId
      );
    } catch (error) {
      console.error(
        "Update task error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update task"
      );
    }
  };

  // =========================
  // DELETE TASK
  // =========================

  const deleteTask = async (
    id: number,
    projectId: number | null
  ) => {
    try {
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to delete task"
        );
      }

      setTasks((prev) =>
        prev.filter(
          (task) => task.id !== id
        )
      );

      await updateProjectProgress(
        projectId
      );
    } catch (error) {
      console.error(
        "Delete task error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete task"
      );
    }
  };

  // =========================
  // TASK GROUPS
  // =========================

  const pendingTasks = tasks.filter(
    (task) => task.status !== "completed"
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  );

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen px-5 sm:px-8 lg:px-10 py-8">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">

        <div>
          <p className="text-xs uppercase tracking-widest text-[#777467]">
            Productivity
          </p>

          <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl mt-2">
            Your tasks.
          </h1>

          <p className="text-sm text-[#777467] mt-3">
            Everything DELYRA is helping you get done.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchTasks}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/70 border border-white hover:bg-white transition disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

        <div className="bg-white/65 border border-white rounded-3xl p-5">
          <p className="text-xs uppercase tracking-widest text-[#999386]">
            Total
          </p>

          <p className="text-3xl font-semibold mt-2">
            {tasks.length}
          </p>
        </div>

        <div className="bg-[#ded8c9]/60 border border-white/60 rounded-3xl p-5">
          <p className="text-xs uppercase tracking-widest text-[#777467]">
            Pending
          </p>

          <p className="text-3xl font-semibold mt-2">
            {pendingTasks.length}
          </p>
        </div>

        <div className="bg-[#d9a9a3]/30 border border-white/70 rounded-3xl p-5">
          <p className="text-xs uppercase tracking-widest text-[#777467]">
            Completed
          </p>

          <p className="text-3xl font-semibold mt-2">
            {completedTasks.length}
          </p>
        </div>

      </div>

      {/* LOADING */}

      {loading ? (
        <div className="bg-white/60 border border-white rounded-3xl p-10 text-center">

          <RefreshCw
            size={22}
            className="mx-auto animate-spin text-[#777467]"
          />

          <p className="text-sm text-[#777467] mt-3">
            Loading your tasks...
          </p>

        </div>
      ) : tasks.length === 0 ? (

        /* EMPTY STATE */

        <div className="bg-white/60 border border-white rounded-3xl p-12 text-center">

          <div className="w-14 h-14 rounded-full bg-[#ded8c9] flex items-center justify-center mx-auto">
            <Plus size={22} />
          </div>

          <h2 className="font-['Playfair_Display'] text-2xl mt-5">
            No tasks yet.
          </h2>

          <p className="text-sm text-[#777467] mt-2">
            Ask DELYRA to create a task for you.
          </p>

        </div>
      ) : (

        /* TASK LIST */

        <div className="space-y-8">

          {/* PENDING */}

          {pendingTasks.length > 0 && (
            <section>

              <div className="flex items-center gap-2 mb-4">
                <Clock3 size={17} />

                <h2 className="font-['Playfair_Display'] text-2xl">
                  To do
                </h2>
              </div>

              <div className="space-y-3">

                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-5 flex items-center gap-4"
                  >

                    <button
                      type="button"
                      onClick={() =>
                        toggleTask(task)
                      }
                      className="shrink-0 text-[#777467] hover:text-[#25251d] transition"
                      title="Mark as completed"
                    >
                      <Circle size={23} />
                    </button>

                    <div className="min-w-0 flex-1">

                      <h3 className="font-medium text-[#292820]">
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-sm text-[#777467] mt-1">
                          {task.description}
                        </p>
                      )}

                      {task.dueDate && (
                        <p className="text-xs text-[#999386] mt-2">
                          Due: {task.dueDate}
                        </p>
                      )}

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        deleteTask(
                          task.id,
                          task.projectId
                        )
                      }
                      className="p-2 rounded-full text-[#999386] hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete task"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>
                ))}

              </div>
            </section>
          )}

          {/* COMPLETED */}

          {completedTasks.length > 0 && (
            <section>

              <div className="flex items-center gap-2 mb-4">

                <Check size={17} />

                <h2 className="font-['Playfair_Display'] text-2xl">
                  Completed
                </h2>

              </div>

              <div className="space-y-3">

                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white/45 border border-white/70 rounded-3xl p-5 flex items-center gap-4"
                  >

                    <button
                      type="button"
                      onClick={() =>
                        toggleTask(task)
                      }
                      className="shrink-0 w-6 h-6 rounded-full bg-[#8b9276] text-white flex items-center justify-center"
                      title="Mark as pending"
                    >
                      <Check size={14} />
                    </button>

                    <div className="min-w-0 flex-1">

                      <h3 className="font-medium text-[#777467] line-through">
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-sm text-[#999386] mt-1 line-through">
                          {task.description}
                        </p>
                      )}

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        deleteTask(
                          task.id,
                          task.projectId
                        )
                      }
                      className="p-2 rounded-full text-[#999386] hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete task"
                    >
                      <Trash2 size={17} />
                    </button>

                  </div>
                ))}

              </div>
            </section>
          )}

        </div>
      )}

    </div>
  );
}

export default Tasks;