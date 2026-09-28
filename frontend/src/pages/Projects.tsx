import { useEffect, useState } from "react";
import {
  Folder,
  Plus,
  ArrowUpRight,
  Trash2,
  X,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Project = {
  id: number;
  name: string;
  description: string | null;
  progress: number;
};

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================
  // FETCH PROJECTS
  // =========================

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/projects"
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to fetch projects"
        );
      }

      setProjects(
        data.projects || []
      );
    } catch (error) {
      console.error(
        "Fetch projects error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load projects"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD PROJECTS
  // =========================

  useEffect(() => {
    fetchProjects();
  }, []);

  // =========================
  // CREATE PROJECT
  // =========================

  const createProject = async () => {
    if (!name.trim()) {
      setError(
        "Please enter a project name."
      );
      return;
    }

    if (!description.trim()) {
      setError(
        "Please enter a project description."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/projects",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            description:
              description.trim(),
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
            "Failed to create project"
        );
      }

      setProjects(
        (previousProjects) => [
          data.project,
          ...previousProjects,
        ]
      );

      setName("");
      setDescription("");
      setShowModal(false);
    } catch (error) {
      console.error(
        "Create project error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create project"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE PROJECT
  // =========================

  const deleteProject = async (
    event: React.MouseEvent,
    id: number
  ) => {
    event.stopPropagation();

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}`,
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
            "Failed to delete project"
        );
      }

      setProjects(
        (previousProjects) =>
          previousProjects.filter(
            (project) =>
              project.id !== id
          )
      );
    } catch (error) {
      console.error(
        "Delete project error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete project"
      );
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredProjects =
    projects.filter((project) => {
      const query =
        search.toLowerCase();

      return (
        project.name
          .toLowerCase()
          .includes(query) ||
        (
          project.description || ""
        )
          .toLowerCase()
          .includes(query)
      );
    });

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen px-6 lg:px-10 py-10">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-5">

        <div>
          <p className="text-xs uppercase tracking-widest text-[#777467]">
            Workspace
          </p>

          <h1 className="font-['Playfair_Display'] text-5xl mt-2">
            Projects
          </h1>

          <p className="text-sm text-[#777467] mt-3">
            Everything you're building,
            in one place.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setName("");
            setDescription("");
            setError("");
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#25251d] text-white text-sm hover:scale-105 transition"
        >
          <Plus size={17} />
          New Project
        </button>

      </div>

      {/* SEARCH */}

      <div className="mt-8 max-w-xl bg-white/60 border border-white rounded-full px-5 py-3 flex items-center gap-3">

        <Search
          size={18}
          className="text-[#777467]"
        />

        <input
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Search projects..."
          className="bg-transparent outline-none w-full text-sm"
        />

      </div>

      {/* ERROR */}

      {error && !showModal && (
        <div className="mt-6 max-w-2xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* COUNT */}

      <div className="flex justify-end mt-5">
        <span className="text-xs text-[#999386]">
          {projects.length}{" "}
          {projects.length === 1
            ? "project"
            : "projects"}
        </span>
      </div>

      {/* LOADING */}

      {loading ? (
        <div className="mt-8 bg-white/60 border border-white rounded-3xl p-12 text-center">
          <p className="text-sm text-[#777467]">
            Loading projects...
          </p>
        </div>
      ) : filteredProjects.length ===
        0 ? (
        <div className="mt-8 bg-white/60 border border-white rounded-3xl p-12 text-center">

          <div className="w-14 h-14 rounded-full bg-[#e8dfd1] flex items-center justify-center mx-auto">
            <Folder size={22} />
          </div>

          <h2 className="font-['Playfair_Display'] text-2xl mt-5">
            No projects found.
          </h2>

          <p className="text-sm text-[#777467] mt-2">
            Create your first project.
          </p>

        </div>
      ) : (

        /* PROJECT GRID */

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">

          {filteredProjects.map(
            (project) => (
              <div
                key={project.id}
                onClick={() =>
                  navigate(
                    `/projects/${project.id}`
                  )
                }
                className="bg-white/60 border border-white rounded-3xl p-6 hover:-translate-y-1 hover:bg-white/80 transition cursor-pointer"
              >

                {/* CARD HEADER */}

                <div className="flex justify-between items-start">

                  <div className="w-11 h-11 rounded-2xl bg-[#e8dfd1] flex items-center justify-center">
                    <Folder size={20} />
                  </div>

                  <div className="flex items-center gap-1">

                    <button
                      type="button"
                      onClick={(event) =>
                        deleteProject(
                          event,
                          project.id
                        )
                      }
                      className="p-2 rounded-full text-[#999386] hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete project"
                    >
                      <Trash2 size={16} />
                    </button>

                    <ArrowUpRight
                      size={19}
                      className="text-[#777467]"
                    />

                  </div>

                </div>

                {/* NAME */}

                <h2 className="font-['Playfair_Display'] text-2xl mt-6">
                  {project.name}
                </h2>

                {/* DESCRIPTION */}

                <p className="text-sm text-[#777467] mt-2 leading-6">
                  {project.description ||
                    "No description added."}
                </p>

                {/* PROGRESS */}

                <div className="mt-7">

                  <div className="flex justify-between text-xs mb-2">

                    <span className="text-[#777467]">
                      Progress
                    </span>

                    <span>
                      {project.progress}%
                    </span>

                  </div>

                  <div className="h-2 bg-[#ddd7cc] rounded-full overflow-hidden">

                    <div
                      className="h-2 bg-[#8b9276] rounded-full transition-all duration-500"
                      style={{
                        width: `${project.progress}%`,
                      }}
                    />

                  </div>

                </div>

                <p className="text-xs text-[#999386] mt-4">
                  Click to open project →
                </p>

              </div>
            )
          )}

        </div>
      )}

      {/* NEW PROJECT MODAL */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black/30 backdrop-blur-sm">

          <div className="w-full max-w-lg bg-[#f8f5ee] border border-white rounded-3xl p-6 sm:p-8 shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs uppercase tracking-widest text-[#777467]">
                  Workspace
                </p>

                <h2 className="font-['Playfair_Display'] text-3xl mt-1">
                  New Project
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setError("");
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#e8e2d7] transition"
              >
                <X size={18} />
              </button>

            </div>

            {/* MODAL ERROR */}

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* NAME */}

            <div className="mt-6">

              <label className="text-sm font-medium text-[#555247]">
                Project Name
              </label>

              <input
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="e.g. BrainBytes"
                className="w-full mt-2 px-4 py-3 rounded-2xl bg-white/70 border border-white outline-none text-sm"
              />

            </div>

            {/* DESCRIPTION */}

            <div className="mt-5">

              <label className="text-sm font-medium text-[#555247]">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="What are you building?"
                rows={4}
                className="w-full mt-2 px-4 py-3 rounded-2xl bg-white/70 border border-white outline-none text-sm resize-none"
              />

            </div>

            {/* BUTTONS */}

            <div className="flex justify-end gap-3 mt-7">

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setError("");
                }}
                disabled={saving}
                className="px-5 py-3 rounded-full bg-white/70 border border-white text-sm hover:bg-white transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={createProject}
                disabled={
                  saving ||
                  !name.trim() ||
                  !description.trim()
                }
                className="px-6 py-3 rounded-full bg-[#25251d] text-white text-sm hover:scale-105 transition disabled:opacity-40 disabled:hover:scale-100"
              >
                {saving
                  ? "Creating..."
                  : "Create Project"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Projects;