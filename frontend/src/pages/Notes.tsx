import { useEffect, useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Trash2,
  RefreshCw,
  X,
} from "lucide-react";

type Note = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
};

function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/notes"
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch notes"
        );
      }

      setNotes(data.notes || []);
    } catch (error) {
      console.error("Fetch notes error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load notes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleNewNote = () => {
    setTitle("");
    setContent("");
    setError("");
    setShowModal(true);
  };

  const handleCreateNote = async () => {
    if (!title.trim()) {
      setError("Please enter a note title.");
      return;
    }

    if (!content.trim()) {
      setError("Please enter note content.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/notes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to create note"
        );
      }

      setNotes((prev) => [data.note, ...prev]);

      setTitle("");
      setContent("");
      setShowModal(false);
    } catch (error) {
      console.error("Create note error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create note"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete note"
        );
      }

      setNotes((prev) =>
        prev.filter((note) => note.id !== id)
      );
    } catch (error) {
      console.error("Delete note error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete note"
      );
    }
  };

  const filteredNotes = notes.filter((note) => {
    const query = search.toLowerCase();

    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen px-6 lg:px-10 py-10">
      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#777467]">
            Your space
          </p>

          <h1 className="font-['Playfair_Display'] text-5xl mt-2">
            Notes
          </h1>

          <p className="text-sm text-[#777467] mt-3">
            Capture ideas before they disappear.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNewNote}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#25251d] text-white text-sm hover:scale-105 transition"
        >
          <Plus size={17} />
          New Note
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
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your notes..."
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      {/* ERROR */}

      {error && !showModal && (
        <div className="mt-6 max-w-xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* REFRESH */}

      <div className="flex justify-end mt-5">
        <button
          type="button"
          onClick={fetchNotes}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white text-sm hover:bg-white transition disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* NOTES */}

      {loading ? (
        <div className="mt-8 bg-white/60 border border-white rounded-3xl p-12 text-center">
          <RefreshCw
            size={22}
            className="mx-auto animate-spin text-[#777467]"
          />

          <p className="text-sm text-[#777467] mt-3">
            Loading your notes...
          </p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="mt-8 bg-white/60 border border-white rounded-3xl p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-[#ded8c9] flex items-center justify-center mx-auto">
            <FileText size={22} />
          </div>

          <h2 className="font-['Playfair_Display'] text-2xl mt-5">
            {search
              ? "No matching notes."
              : "No notes yet."}
          </h2>

          <p className="text-sm text-[#777467] mt-2">
            {search
              ? "Try a different search."
              : "Ask DELYRA to create a note for you."}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white/60 border border-white rounded-3xl p-6 hover:bg-white/80 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <FileText
                  size={21}
                  className="text-[#777467]"
                />

                <button
                  type="button"
                  onClick={() => deleteNote(note.id)}
                  className="p-2 rounded-full text-[#999386] hover:text-red-600 hover:bg-red-50 transition"
                  title="Delete note"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h2 className="font-['Playfair_Display'] text-2xl mt-5">
                {note.title}
              </h2>

              <p className="text-sm text-[#777467] mt-3 leading-6">
                {note.content}
              </p>

              <p className="text-xs text-[#aaa397] mt-6">
                Updated recently
              </p>
            </div>
          ))}
        </div>
      )}

      {/* NEW NOTE MODAL */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#f8f5ee] border border-white rounded-3xl p-6 sm:p-8 shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#777467]">
                  Create
                </p>

                <h2 className="font-['Playfair_Display'] text-3xl mt-1">
                  New Note
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
                Title
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. DSA Revision"
                className="w-full mt-2 px-4 py-3 rounded-2xl bg-white/70 border border-white outline-none text-sm focus:ring-2 focus:ring-[#8b9276]/30"
              />
            </div>

            {/* CONTENT */}

            <div className="mt-5">
              <label className="text-sm font-medium text-[#555247]">
                Content
              </label>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note here..."
                rows={7}
                className="w-full mt-2 px-4 py-3 rounded-2xl bg-white/70 border border-white outline-none text-sm resize-none focus:ring-2 focus:ring-[#8b9276]/30"
              />
            </div>

            {/* ACTIONS */}

            <div className="flex justify-end gap-3 mt-6">
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
                onClick={handleCreateNote}
                disabled={
                  saving ||
                  !title.trim() ||
                  !content.trim()
                }
                className="px-6 py-3 rounded-full bg-[#25251d] text-white text-sm hover:scale-105 transition disabled:opacity-40 disabled:hover:scale-100"
              >
                {saving ? "Saving..." : "Save Note"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;