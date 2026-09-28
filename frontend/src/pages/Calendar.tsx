import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
  RefreshCw,
} from "lucide-react";

type CalendarEvent = {
  id: number;
  title: string;
  description: string | null;
  date: string;
  time: string;
  createdAt: string;
};

function Calendar() {
  const [currentDate, setCurrentDate] =
    useState(new Date());

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [events, setEvents] =
    useState<CalendarEvent[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [eventDate, setEventDate] =
    useState("");

  const [eventTime, setEventTime] =
    useState("");

  // =========================
  // DATE HELPERS
  // =========================

  const formatDate = (date: Date) => {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );
  };

  const isSameDate = (
    first: Date,
    second: Date
  ) => {
    return (
      first.getFullYear() ===
        second.getFullYear() &&
      first.getMonth() ===
        second.getMonth() &&
      first.getDate() ===
        second.getDate()
    );
  };

  // =========================
  // FETCH EVENTS
  // =========================

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/calendar"
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to fetch calendar events"
        );
      }

      setEvents(data.events || []);
    } catch (error) {
      console.error(
        "Fetch calendar events error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load calendar events"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD EVENTS
  // =========================

  useEffect(() => {
    fetchEvents();
  }, []);

  // =========================
  // CALENDAR DAYS
  // =========================

  const calendarDays = useMemo(() => {
    const year =
      currentDate.getFullYear();

    const month =
      currentDate.getMonth();

    const firstDay = new Date(
      year,
      month,
      1
    );

    const lastDay = new Date(
      year,
      month + 1,
      0
    );

    // Monday = 0 ... Sunday = 6
    const startDay =
      (firstDay.getDay() + 6) % 7;

    const totalDays =
      lastDay.getDate();

    const days: Date[] = [];

    // Previous month days
    for (
      let index = startDay - 1;
      index >= 0;
      index--
    ) {
      days.push(
        new Date(
          year,
          month,
          -index
        )
      );
    }

    // Current month days
    for (
      let day = 1;
      day <= totalDays;
      day++
    ) {
      days.push(
        new Date(
          year,
          month,
          day
        )
      );
    }

    // Next month days
    let nextDay = 1;

    while (days.length % 7 !== 0) {
      days.push(
        new Date(
          year,
          month + 1,
          nextDay
        )
      );

      nextDay++;
    }

    return days;
  }, [currentDate]);

  // =========================
  // EVENTS FOR SELECTED DATE
  // =========================

  const selectedDateEvents =
    events
      .filter(
        (event) =>
          event.date ===
          formatDate(selectedDate)
      )
      .sort((a, b) =>
        a.time.localeCompare(b.time)
      );

  // =========================
  // MONTH NAVIGATION
  // =========================

  const goToPreviousMonth = () => {
    setCurrentDate(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() - 1,
          1
        )
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + 1,
          1
        )
    );
  };

  // =========================
  // OPEN ADD EVENT MODAL
  // =========================

  const openAddEvent = () => {
    setTitle("");
    setDescription("");
    setEventDate(
      formatDate(selectedDate)
    );
    setEventTime("");
    setError("");
    setShowModal(true);
  };

  // =========================
  // CREATE EVENT
  // =========================

  const createEvent = async () => {
    if (!title.trim()) {
      setError(
        "Please enter an event title."
      );
      return;
    }

    if (!eventDate) {
      setError(
        "Please select a date."
      );
      return;
    }

    if (!eventTime) {
      setError(
        "Please select a time."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/calendar",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title: title.trim(),
            description:
              description.trim() ||
              null,
            date: eventDate,
            time: eventTime,
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
            "Failed to create event"
        );
      }

      setEvents((previous) => [
        data.event,
        ...previous,
      ]);

      const createdDate =
        new Date(
          `${eventDate}T00:00:00`
        );

      setSelectedDate(createdDate);

      setCurrentDate(
        new Date(
          createdDate.getFullYear(),
          createdDate.getMonth(),
          1
        )
      );

      setShowModal(false);
      setTitle("");
      setDescription("");
      setEventDate("");
      setEventTime("");
    } catch (error) {
      console.error(
        "Create event error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create event"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE EVENT
  // =========================

  const deleteEvent = async (
    id: number
  ) => {
    try {
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/calendar/${id}`,
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
            "Failed to delete event"
        );
      }

      setEvents((previous) =>
        previous.filter(
          (event) =>
            event.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete event error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete event"
      );
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen px-6 lg:px-10 py-10">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-5">

        <div>
          <p className="text-xs uppercase tracking-widest text-[#777467]">
            Schedule
          </p>

          <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl mt-2">
            Calendar
          </h1>

          <p className="text-sm text-[#777467] mt-3">
            Organize your schedule with DELYRA.
          </p>
        </div>

        <div className="flex gap-2">

          <button
            type="button"
            onClick={fetchEvents}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-white/70 border border-white text-sm hover:bg-white transition disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={openAddEvent}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#25251d] text-white text-sm hover:scale-105 transition"
          >
            <Plus size={17} />
            Add Event
          </button>

        </div>

      </div>

      {/* ERROR */}

      {error && !showModal && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* CALENDAR */}

      <div className="mt-10 bg-white/60 border border-white rounded-3xl p-5 lg:p-7">

        {/* MONTH HEADER */}

        <div className="flex justify-between items-center mb-7">

          <h2 className="font-['Playfair_Display'] text-2xl">
            {formatMonthYear(
              currentDate
            )}
          </h2>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={
                goToPreviousMonth
              }
              className="p-2 rounded-full hover:bg-[#e8dfd1] transition"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={
                goToNextMonth
              }
              className="p-2 rounded-full hover:bg-[#e8dfd1] transition"
            >
              <ChevronRight size={18} />
            </button>

          </div>

        </div>

        {/* WEEK DAYS */}

        <div className="grid grid-cols-7 gap-2 mb-2">

          {[
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
          ].map((day) => (
            <div
              key={day}
              className="text-xs text-[#777467] text-center py-2"
            >
              {day}
            </div>
          ))}

        </div>

        {/* CALENDAR GRID */}

        <div className="grid grid-cols-7 gap-2">

          {calendarDays.map((day) => {
            const isCurrentMonth =
              day.getMonth() ===
                currentDate.getMonth() &&
              day.getFullYear() ===
                currentDate.getFullYear();

            const isSelected =
              isSameDate(
                day,
                selectedDate
              );

            const hasEvents =
              events.some(
                (event) =>
                  event.date ===
                  formatDate(day)
              );

            return (
              <button
                type="button"
                key={formatDate(day)}
                onClick={() =>
                  setSelectedDate(day)
                }
                className={`min-h-24 rounded-2xl p-3 text-left transition ${
                  isSelected
                    ? "bg-[#8b9276] text-white"
                    : isCurrentMonth
                    ? "bg-[#f5f0e8]/70 hover:bg-[#e8dfd1]"
                    : "bg-[#f5f0e8]/30 text-[#aaa59b]"
                }`}
              >

                <p className="text-xs">
                  {day.toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                    }
                  )}
                </p>

                <p className="text-xl mt-2">
                  {day.getDate()}
                </p>

                {hasEvents && (
                  <div className="flex gap-1 mt-3">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected
                          ? "bg-white"
                          : "bg-[#8b9276]"
                      }`}
                    />
                  </div>
                )}

              </button>
            );
          })}

        </div>

      </div>

      {/* SELECTED DAY SCHEDULE */}

      <div className="mt-6 bg-white/60 border border-white rounded-3xl p-6">

        <div className="flex justify-between items-center">

          <div>
            <p className="text-xs uppercase tracking-widest text-[#777467]">
              Schedule
            </p>

            <h2 className="font-['Playfair_Display'] text-2xl mt-1">
              {isSameDate(
                selectedDate,
                new Date()
              )
                ? "Today's schedule"
                : selectedDate.toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    }
                  )}
            </h2>
          </div>

          <span className="text-xs text-[#999386]">
            {selectedDateEvents.length}{" "}
            {selectedDateEvents.length ===
            1
              ? "event"
              : "events"}
          </span>

        </div>

        {selectedDateEvents.length ===
        0 ? (
          <div className="mt-5 bg-[#f5f0e8]/70 rounded-2xl p-8 text-center">

            <p className="text-sm text-[#777467]">
              No events scheduled.
            </p>

            <button
              type="button"
              onClick={openAddEvent}
              className="mt-4 text-sm underline text-[#555247]"
            >
              Add an event
            </button>

          </div>
        ) : (
          <div className="mt-5 space-y-3">

            {selectedDateEvents.map(
              (event) => (
                <div
                  key={event.id}
                  className="flex gap-4 items-center p-4 rounded-2xl bg-[#f5f0e8]/70"
                >

                  <span className="text-xs text-[#777467] w-20 shrink-0">
                    {event.time}
                  </span>

                  <div className="flex-1 min-w-0">

                    <p className="text-sm font-medium">
                      {event.title}
                    </p>

                    {event.description && (
                      <p className="text-xs text-[#999386] mt-1">
                        {event.description}
                      </p>
                    )}

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      deleteEvent(
                        event.id
                      )
                    }
                    className="p-2 rounded-full text-[#999386] hover:text-red-600 hover:bg-red-50 transition"
                    title="Delete event"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              )
            )}

          </div>
        )}

      </div>

      {/* ADD EVENT MODAL */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black/30 backdrop-blur-sm">

          <div className="w-full max-w-lg bg-[#f8f5ee] border border-white rounded-3xl p-6 sm:p-8 shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex justify-between items-start">

              <div>
                <p className="text-xs uppercase tracking-widest text-[#777467]">
                  Schedule
                </p>

                <h2 className="font-['Playfair_Display'] text-3xl mt-1">
                  Add Event
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

            {/* TITLE */}

            <div className="mt-6">

              <label className="text-sm font-medium text-[#555247]">
                Event Title
              </label>

              <input
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                placeholder="e.g. DSA Practice"
                className="w-full mt-2 px-4 py-3 rounded-2xl bg-white/70 border border-white outline-none text-sm"
              />

            </div>

            {/* DATE + TIME */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">

              <div>

                <label className="text-sm font-medium text-[#555247]">
                  Date
                </label>

                <input
                  type="date"
                  value={eventDate}
                  onChange={(event) =>
                    setEventDate(
                      event.target.value
                    )
                  }
                  className="w-full mt-2 px-4 py-3 rounded-2xl bg-white/70 border border-white outline-none text-sm"
                />

              </div>

              <div>

                <label className="text-sm font-medium text-[#555247]">
                  Time
                </label>

                <input
                  type="time"
                  value={eventTime}
                  onChange={(event) =>
                    setEventTime(
                      event.target.value
                    )
                  }
                  className="w-full mt-2 px-4 py-3 rounded-2xl bg-white/70 border border-white outline-none text-sm"
                />

              </div>

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
                placeholder="Optional details..."
                rows={3}
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
                onClick={createEvent}
                disabled={
                  saving ||
                  !title.trim() ||
                  !eventDate ||
                  !eventTime
                }
                className="px-6 py-3 rounded-full bg-[#25251d] text-white text-sm hover:scale-105 transition disabled:opacity-40 disabled:hover:scale-100"
              >
                {saving
                  ? "Saving..."
                  : "Save Event"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Calendar;