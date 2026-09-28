import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
} from "lucide-react";

type Project = {
  id: number;
  name: string;
  description: string | null;
  progress: number;
};

type ProjectTask = {
  id: number;
  projectId: number | null;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: string;
};

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const projectId = Number(id);

  const [project, setProject] =
    useState<Project | null>(null);

  const [tasks, setTasks] =
    useState<ProjectTask[]>([]);

  const [newTask, setNewTask] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [savingTask, setSavingTask] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================
  // LOAD PROJECT
  // =========================

  const fetchProject = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/projects"
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to fetch project"
        );
      }

      const foundProject =
        data.projects.find(
          (item: Project) =>
            item.id === projectId
        );

      if (!foundProject) {
        setProject(null);
        return;
      }

      setProject(foundProject);
    } catch (error) {
      console.error(
        "Fetch project error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load project"
      );
    }
  };

  // =========================
  // LOAD TASKS
  // =========================

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/tasks"
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to fetch tasks"
        );
      }

      const projectTasks =
        data.tasks.filter(
          (task: ProjectTask) =>
            task.projectId === projectId
        );

      setTasks(projectTasks);
    } catch (error) {
      console.error(
        "Fetch tasks error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load tasks"
      );
    }
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      await Promise.all([
        fetchProject(),
        fetchTasks(),
      ]);

      setLoading(false);
    };

    loadData();
  }, [projectId]);

  // =========================
  // UPDATE PROJECT PROGRESS
  // =========================

  const updateProjectProgress = async (
    updatedTasks: ProjectTask[]
  ) => {
    const total = updatedTasks.length;

    const completed =
      updatedTasks.filter(
        (task) =>
          task.status === "completed"
      ).length;

    const progress =
      total === 0
        ? 0
        : Math.round(
            (completed / total) * 100
          );

    try {
      const response = await fetch(
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

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to update progress"
        );
      }

      setProject((current) =>
        current
          ? {
              ...current,
              progress,
            }
          : current
      );
    } catch (error) {
      console.error(
        "Update progress error:",
        error
      );
    }
  };

  // =========================
  // ADD TASK
  // =========================

  const addTask = async () => {
    const title = newTask.trim();

    if (!title || savingTask) {
      return;
    }

    try {
      setSavingTask(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/tasks",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title,
            projectId,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to create task"
        );
      }

      const updatedTasks = [
        ...tasks,
        data.task,
      ];

      setTasks(updatedTasks);
      setNewTask("");

      await updateProjectProgress(
        updatedTasks
      );
    } catch (error) {
      console.error(
        "Create task error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create task"
      );
    } finally {
      setSavingTask(false);
    }
  };

  // =========================
  // TOGGLE TASK
  // =========================

  const toggleTask = async (
    task: ProjectTask
  ) => {
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

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to update task"
        );
      }

      const updatedTasks =
        tasks.map((item) =>
          item.id === task.id
            ? {
                ...item,
                status: newStatus,
              }
            : item
        );

      setTasks(updatedTasks);

      await updateProjectProgress(
        updatedTasks
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
    taskId: number
  ) => {
    try {
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to delete task"
        );
      }

      const updatedTasks =
        tasks.filter(
          (task) =>
            task.id !== taskId
        );

      setTasks(updatedTasks);

      await updateProjectProgress(
        updatedTasks
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
  // PROJECT NOT FOUND
  // =========================

  if (!loading && !project) {
    return (
      <div className="min-h-screen px-6 lg:px-10 py-10">

        <button
          type="button"
          onClick={() =>
            navigate("/projects")
          }
          className="flex items-center gap-2 text-sm text-[#777467] hover:text-[#25251d]"
        >
          <ArrowLeft size={17} />
          Back to Projects
        </button>

        <div className="mt-10 bg-white/60 border border-white rounded-3xl p-10 text-center">
          <h1 className="font-['Playfair_Display'] text-3xl">
            Project not found
          </h1>
        </div>

      </div>
    );
  }

  // =========================
  // LOADING
  // =========================

  if (loading || !project) {
    return (
      <div className="min-h-screen px-6 lg:px-10 py-10">

        <div className="bg-white/60 border border-white rounded-3xl p-10 text-center">
          <p className="text-sm text-[#777467]">
            Loading project...
          </p>
        </div>

      </div>
    );
  }

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "completed"
    ).length;

  return (
    <div className="min-h-screen px-6 lg:px-10 py-10">

      {/* BACK */}

      <button
        type="button"
        onClick={() =>
          navigate("/projects")
        }
        className="flex items-center gap-2 text-sm text-[#777467] hover:text-[#25251d]"
      >
        <ArrowLeft size={17} />
        Back to Projects
      </button>

      {/* PROJECT HEADER */}

      <div className="mt-8 bg-white/60 border border-white rounded-3xl p-7 sm:p-9">

        <p className="text-xs uppercase tracking-widest text-[#777467]">
          Project
        </p>

        <div className="flex flex-col lg:flex-row lg:justify-between gap-8 mt-2">

          <div>
            <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl">
              {project.name}
            </h1>

            <p className="text-sm text-[#777467] mt-3 max-w-2xl">
              {project.description ||
                "No description added."}
            </p>
          </div>

          {/* REAL PROGRESS */}

          <div className="lg:w-72">

            <div className="flex justify-between text-sm mb-2">

              <span className="text-[#777467]">
                Real Progress
              </span>

              <span>
                {project.progress}%
              </span>

            </div>

            <div className="h-3 bg-[#ddd7cc] rounded-full overflow-hidden">

              <div
                className="h-3 bg-[#8b9276] rounded-full transition-all duration-500"
                style={{
                  width: `${project.progress}%`,
                }}
              />

            </div>

            <p className="text-xs text-[#999386] mt-2">
              {completedTasks} of{" "}
              {tasks.length} tasks
              completed
            </p>

          </div>

        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* TASKS */}

      <div className="mt-10">

        <div className="flex justify-between items-end">

          <div>
            <p className="text-xs uppercase tracking-widest text-[#777467]">
              Execution
            </p>

            <h2 className="font-['Playfair_Display'] text-3xl mt-1">
              Project Tasks
            </h2>
          </div>

          <span className="text-xs text-[#999386]">
            {tasks.length}{" "}
            {tasks.length === 1
              ? "task"
              : "tasks"}
          </span>

        </div>

        {/* ADD TASK */}

        <div className="mt-6 bg-white/60 border border-white rounded-3xl p-4 flex gap-3">

          <input
            value={newTask}
            onChange={(event) =>
              setNewTask(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter"
              ) {
                event.preventDefault();
                addTask();
              }
            }}
            placeholder="What needs to be done?"
            disabled={savingTask}
            className="flex-1 bg-transparent outline-none px-2 text-sm disabled:opacity-50"
          />

          <button
            type="button"
            onClick={addTask}
            disabled={
              !newTask.trim() ||
              savingTask
            }
            className="w-10 h-10 rounded-full bg-[#25251d] text-white flex items-center justify-center disabled:opacity-40 hover:scale-105 transition"
          >
            <Plus size={17} />
          </button>

        </div>

        {/* EMPTY */}

        {tasks.length === 0 ? (
          <div className="mt-5 bg-white/60 border border-white rounded-3xl p-10 text-center">

            <h3 className="font-['Playfair_Display'] text-2xl">
              No tasks yet
            </h3>

            <p className="text-sm text-[#777467] mt-2">
              Add your first task above
              to start tracking progress.
            </p>

          </div>
        ) : (

          <div className="mt-5 space-y-3">

            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/60 border border-white rounded-2xl px-5 py-4 flex items-center gap-4"
              >

                <button
                  type="button"
                  onClick={() =>
                    toggleTask(task)
                  }
                  className="shrink-0"
                >
                  {task.status ===
                  "completed" ? (
                    <CheckCircle2
                      size={21}
                      className="text-[#8b9276]"
                    />
                  ) : (
                    <Circle
                      size={21}
                      className="text-[#999386]"
                    />
                  )}
                </button>

                <span
                  className={`flex-1 text-sm ${
                    task.status ===
                    "completed"
                      ? "line-through text-[#999386]"
                      : "text-[#555247]"
                  }`}
                >
                  {task.title}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    deleteTask(task.id)
                  }
                  className="p-2 rounded-full text-[#999386] hover:text-red-600 hover:bg-red-50 transition"
                >
                  <Trash2 size={16} />
                </button>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default ProjectDetails;