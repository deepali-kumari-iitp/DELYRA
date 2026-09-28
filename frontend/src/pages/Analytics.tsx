import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  FolderKanban,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

type Task = {
  id: number;
  title: string;
  status: string;
  createdAt: string;
  projectId: number | null;
};

type Project = {
  id: number;
  name: string;
  progress: number;
  createdAt: string;
};

type CalendarEvent = {
  id: number;
  title: string;
  date: string;
  time: string;
};

type Note = {
  id: number;
  title: string;
  createdAt: string;
};

function Analytics() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [
          tasksResponse,
          projectsResponse,
          eventsResponse,
          notesResponse,
        ] = await Promise.all([
          fetch("http://localhost:5000/api/tasks"),
          fetch("http://localhost:5000/api/projects"),
          fetch("http://localhost:5000/api/calendar"),
          fetch("http://localhost:5000/api/notes"),
        ]);

        const tasksData = await tasksResponse.json();
        const projectsData = await projectsResponse.json();
        const eventsData = await eventsResponse.json();
        const notesData = await notesResponse.json();

        setTasks(tasksData.tasks || []);
        setProjects(projectsData.projects || []);
        setEvents(eventsData.events || []);
        setNotes(notesData.notes || []);
      } catch (error) {
        console.error("Analytics loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const completedTasks = tasks.filter(
    (task) => task.status.toLowerCase() === "completed"
  ).length;

  const pendingTasks = tasks.length - completedTasks;

  const completionRate =
    tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100)
      : 0;

  const averageProjectProgress =
    projects.length > 0
      ? Math.round(
          projects.reduce(
            (total, project) => total + project.progress,
            0
          ) / projects.length
        )
      : 0;

  const weeklyActivity = useMemo(() => {
    const today = new Date();

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));

      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const taskCount = tasks.filter((task) => {
        const createdAt = new Date(task.createdAt);

        return (
          createdAt >= dayStart &&
          createdAt <= dayEnd
        );
      }).length;

      return {
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        count: taskCount,
      };
    });
  }, [tasks]);

  const maxActivity = Math.max(
    ...weeklyActivity.map((day) => day.count),
    1
  );

  const stats = [
    {
      title: "Tasks Completed",
      value: completedTasks,
      subtitle: `${pendingTasks} pending`,
      icon: CheckCircle2,
    },
    {
      title: "Total Tasks",
      value: tasks.length,
      subtitle: `${completionRate}% completed`,
      icon: Clock3,
    },
    {
      title: "Projects",
      value: projects.length,
      subtitle: `${averageProjectProgress}% avg progress`,
      icon: FolderKanban,
    },
    {
      title: "Calendar Events",
      value: events.length,
      subtitle: `${notes.length} notes saved`,
      icon: CalendarDays,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen px-6 lg:px-10 py-10">
        <p className="text-xs uppercase tracking-widest text-[#777467]">
          Your progress
        </p>

        <h1 className="font-['Playfair_Display'] text-5xl mt-2">
          Analytics
        </h1>

        <div className="mt-10 bg-white/60 border border-white rounded-3xl p-8">
          <p className="text-sm text-[#777467]">
            Loading your real DELYRA analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 lg:px-10 py-10">
      <p className="text-xs uppercase tracking-widest text-[#777467]">
        Your progress
      </p>

      <h1 className="font-['Playfair_Display'] text-5xl mt-2">
        Analytics
      </h1>

      <p className="text-sm text-[#777467] mt-3">
        A little look at how you're moving forward.
      </p>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-10">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white/60 border border-white rounded-3xl p-6"
            >
              <Icon
                size={21}
                className="text-[#777467]"
              />

              <p className="text-sm text-[#777467] mt-6">
                {stat.title}
              </p>

              <div className="flex items-end justify-between mt-2">
                <h2 className="font-['Playfair_Display'] text-4xl">
                  {stat.value}
                </h2>

                <span className="text-xs bg-[#d9e0d2] px-2 py-1 rounded-full">
                  {stat.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* LOWER SECTION */}
      <div className="mt-6 grid lg:grid-cols-2 gap-5">
        {/* WEEKLY ACTIVITY */}
        <div className="bg-[#e8dfd1]/70 rounded-3xl p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-['Playfair_Display'] text-2xl">
                Weekly activity
              </h2>

              <p className="text-sm text-[#777467] mt-2">
                Tasks created during the last 7 days.
              </p>
            </div>

            <TrendingUp
              size={20}
              className="text-[#777467]"
            />
          </div>

          <div className="flex items-end gap-3 h-48 mt-8">
            {weeklyActivity.map((day) => {
              const height =
                day.count === 0
                  ? 5
                  : Math.max(
                      (day.count / maxActivity) * 100,
                      12
                    );

              return (
                <div
                  key={day.label}
                  className="flex-1 h-full flex flex-col justify-end items-center gap-2"
                >
                  <span className="text-xs text-[#777467]">
                    {day.count}
                  </span>

                  <div
                    className="w-full bg-[#8b9276] rounded-t-xl transition-all"
                    style={{
                      height: `${height}%`,
                    }}
                  />

                  <span className="text-xs text-[#777467]">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* DELYRA IMPACT */}
        <div className="bg-white/60 border border-white rounded-3xl p-7">
          <h2 className="font-['Playfair_Display'] text-2xl">
            DELYRA impact
          </h2>

          <p className="text-sm text-[#777467] mt-4 leading-7">
            DELYRA is helping organize your tasks, projects,
            learning sessions and daily goals into one
            intelligent workspace.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mt-7">
            <div className="p-5 rounded-2xl bg-[#f5f0e8]">
              <p className="text-xs text-[#777467]">
                Task completion
              </p>

              <p className="font-['Playfair_Display'] text-3xl mt-1">
                {completionRate}%
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f5f0e8]">
              <p className="text-xs text-[#777467]">
                Project progress
              </p>

              <p className="font-['Playfair_Display'] text-3xl mt-1">
                {averageProjectProgress}%
              </p>
            </div>
          </div>

          <div className="mt-4 p-5 rounded-2xl bg-[#d9e0d2]/60">
            <p className="text-xs text-[#777467]">
              Workspace activity
            </p>

            <p className="font-['Playfair_Display'] text-2xl mt-1">
              {tasks.length +
                projects.length +
                notes.length +
                events.length}{" "}
              items
            </p>

            <p className="text-xs text-[#777467] mt-1">
              Tasks + projects + notes + calendar events
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;