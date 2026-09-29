import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import {
  BookOpen,
  Search,
  Plus,
  Upload,
  FileText,
  Trash2,
  Sparkles,
  X,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";

import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// =========================
// PDF.JS WORKER
// =========================

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// =========================
// CONSTANTS
// =========================

const STORAGE_KEY = "delyra-knowledge-files";

// We store enough extracted text for DELYRA analysis
// while avoiding browser localStorage size problems.
const MAX_STORED_CONTENT = 12000;

// =========================
// TYPES
// =========================

type KnowledgeFile = {
  id: number;
  name: string;
  size: number;
  type: string;
  content: string;
  isPdf: boolean;
  extractionError?: string;
  analysis?: string;
};

// =========================
// CATEGORIES
// =========================

const categories = [
  "Software Engineering",
  "DSA",
  "React",
  "Backend",
  "DevOps",
  "AI & Agents",
];

// =========================
// COMPONENT
// =========================

function Knowledge() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<KnowledgeFile[]>([]);
  const [search, setSearch] = useState("");

  const [showUpload, setShowUpload] = useState(false);

  const [selectedFile, setSelectedFile] =
    useState<KnowledgeFile | null>(null);

  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // =========================
  // LOAD SAVED KNOWLEDGE
  // =========================

  useEffect(() => {
    try {
      const savedFiles =
        localStorage.getItem(STORAGE_KEY);

      if (!savedFiles) {
        return;
      }

      const parsedFiles =
        JSON.parse(savedFiles);

      if (Array.isArray(parsedFiles)) {
        setFiles(parsedFiles);
      }
    } catch (error) {
      console.error(
        "Failed to load saved knowledge:",
        error
      );
    }
  }, []);

  // =========================
  // SAVE KNOWLEDGE
  // =========================

  const saveFilesToStorage = (
    updatedFiles: KnowledgeFile[]
  ) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedFiles)
      );
    } catch (error) {
      console.error(
        "Failed to save knowledge:",
        error
      );

      setError(
        "The file was processed, but your browser storage is full. Try removing an old knowledge file."
      );
    }
  };

  // =========================
  // FORMAT FILE SIZE
  // =========================

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  

  // =========================
  // EXTRACT PDF TEXT
  // =========================

  const extractPdfText = async (
    file: File
  ) => {
    const arrayBuffer =
      await file.arrayBuffer();

    const pdf =
      await pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      }).promise;

    let fullText = "";

    for (
      let pageNumber = 1;
      pageNumber <= pdf.numPages;
      pageNumber++
    ) {
      const page =
        await pdf.getPage(pageNumber);

      const textContent =
        await page.getTextContent();

      const pageText =
        textContent.items
          .map((item) => {
            if ("str" in item) {
              return item.str;
            }

            return "";
          })
          .join(" ");

      fullText +=
        `\n\n--- Page ${pageNumber} ---\n\n`;

      fullText += pageText;
    }

    return fullText.trim();
  };

  // =========================
  // HANDLE FILE UPLOAD
  // =========================

  const handleFileUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selected =
      event.target.files?.[0];

    // Allow selecting same file again
    event.target.value = "";

    if (!selected) {
      return;
    }

    setError("");
    setAnalysis("");
    setUploading(true);

    try {
      // =========================
      // SIZE CHECK
      // =========================

      if (selected.size > 25 * 1024 * 1024) {
        throw new Error(
          "File is too large. Please upload a file smaller than 25 MB."
        );
      }

      // =========================
      // EXTENSION CHECK
      // =========================

      const lowerName =
        selected.name.toLowerCase();

      const supportedExtensions = [
        ".pdf",
        ".txt",
        ".md",
        ".csv",
        ".json",
      ];

      const isSupported =
        supportedExtensions.some(
          (extension) =>
            lowerName.endsWith(extension)
        );

      if (!isSupported) {
        throw new Error(
          "Currently DELYRA supports PDF, TXT, MD, CSV and JSON files."
        );
      }

      const isPdf =
        lowerName.endsWith(".pdf");

      let content = "";
      let extractionError = "";

      // =========================
      // PDF
      // =========================

      if (isPdf) {
        try {
          content =
            await extractPdfText(selected);

          if (!content.trim()) {
            extractionError =
              "This PDF does not contain selectable text. It may be a scanned/image-only PDF.";
          }
        } catch (pdfError) {
          console.error(
            "PDF text extraction error:",
            pdfError
          );

          extractionError =
            "PDF uploaded successfully, but its text could not be extracted.";
        }
      }

      // =========================
      // TXT / MD / CSV / JSON
      // =========================

      else {
        content =
          await selected.text();
      }

      // =========================
      // STORE ONLY ANALYSIS-SIZED
      // CONTENT
      // =========================

      const storedContent =
        content.slice(
          0,
          MAX_STORED_CONTENT
        );

      // =========================
      // CREATE FILE OBJECT
      // =========================

      const newFile: KnowledgeFile = {
        id: Date.now(),
        name: selected.name,
        size: selected.size,
        type: selected.type,
        content: storedContent,
        isPdf,
        extractionError:
          extractionError || undefined,
      };

      // =========================
      // ADD TO STATE
      // =========================

      setFiles((previousFiles) => {
        const updatedFiles = [
          newFile,
          ...previousFiles,
        ];

        saveFilesToStorage(
          updatedFiles
        );

        return updatedFiles;
      });

      // =========================
      // SELECT FILE
      // =========================

      setSelectedFile(newFile);

      // =========================
      // CLOSE MODAL
      // =========================

      setShowUpload(false);

      // =========================
      // SHOW WARNING
      // =========================

      if (extractionError) {
        setError(extractionError);
      }
    } catch (uploadError) {
      console.error(
        "File upload error:",
        uploadError
      );

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload this file."
      );
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // DELETE FILE
  // =========================

  const deleteFile = (
    id: number
  ) => {
    setFiles((previousFiles) => {
      const updatedFiles =
        previousFiles.filter(
          (file) => file.id !== id
        );

      saveFilesToStorage(
        updatedFiles
      );

      return updatedFiles;
    });

    if (
      selectedFile?.id === id
    ) {
      setSelectedFile(null);
      setAnalysis("");
    }
  };

  // =========================
  // ANALYZE FILE
  // =========================

  const analyzeFile = async (
    file: KnowledgeFile
  ) => {
    if (!file.content.trim()) {
      setSelectedFile(file);

      setError(
        file.extractionError ||
          "There is no readable text available for AI analysis."
      );

      return;
    }

    try {
      setAnalyzing(true);
      setSelectedFile(file);
      setAnalysis("");
      setError("");

      // =========================
      // CONTENT
      // =========================

      const content =
        file.content.slice(
          0,
          MAX_STORED_CONTENT
        );

      // =========================
      // CALL DOCUMENT API
      // =========================

      const response =
        await fetch(
          "http://localhost:5000/api/ai/analyze-document",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              fileName: file.name,
              content,
            }),
          }
        );

      const data =
        await response.json();

      // =========================
      // QUOTA ERROR
      // =========================

      const errorMessage =
        typeof data.message ===
        "string"
          ? data.message
          : "";

      const quotaError =
        response.status === 429 ||
        errorMessage
          .toLowerCase()
          .includes(
            "resource_exhausted"
          ) ||
        errorMessage
          .toLowerCase()
          .includes(
            "quota exceeded"
          ) ||
        errorMessage
          .toLowerCase()
          .includes(
            "generate_content_free_tier_requests"
          );

      if (quotaError) {
        throw new Error(
          "DELYRA's Gemini AI quota has been reached for today. Your file is safely saved. Please try the analysis again after the quota resets."
        );
      }

      // =========================
      // OTHER API ERRORS
      // =========================

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to analyze file."
        );
      }

      // =========================
      // SAVE ANALYSIS
      // =========================

      const generatedAnalysis =
        data.response ||
        "DELYRA could not generate an analysis.";

      setAnalysis(
        generatedAnalysis
      );

      setFiles((previousFiles) => {
        const updatedFiles =
          previousFiles.map(
            (currentFile) =>
              currentFile.id === file.id
                ? {
                    ...currentFile,
                    analysis:
                      generatedAnalysis,
                  }
                : currentFile
          );

        saveFilesToStorage(
          updatedFiles
        );

        return updatedFiles;
      });

      setSelectedFile({
        ...file,
        analysis:
          generatedAnalysis,
      });
    } catch (analysisError) {
      console.error(
        "File analysis error:",
        analysisError
      );

      setError(
        analysisError instanceof Error
          ? analysisError.message
          : "Failed to analyze file."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // =========================
  // SELECT SAVED FILE
  // =========================

  const selectFile = (
    file: KnowledgeFile
  ) => {
    setSelectedFile(file);
    setError("");
    setAnalysis(
      file.analysis || ""
    );
  };

  // =========================
  // SEARCH
  // =========================

  const filteredFiles =
    files.filter((file) =>
      file.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen px-6 lg:px-10 py-10">

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-5">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#777467]">
            Knowledge base
          </p>

          <h1 className="font-['Playfair_Display'] text-5xl mt-2">
            Knowledge
          </h1>

          <p className="text-sm text-[#777467] mt-3">
            Your personal library of everything you're learning.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError("");
            setShowUpload(true);
          }}
          className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-full bg-[#25251d] text-white text-sm hover:scale-105 transition"
        >
          <Plus size={17} />
          Add Knowledge
        </button>
      </div>

      {/* =========================
          SEARCH
      ========================= */}

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
          placeholder="Search knowledge..."
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="mt-6 max-w-3xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =========================
          CATEGORIES
      ========================= */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {categories.map(
          (category) => (
            <div
              key={category}
              className="bg-white/60 border border-white rounded-3xl p-7 hover:-translate-y-1 transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#e8dfd1] flex items-center justify-center">
                <BookOpen size={21} />
              </div>

              <h2 className="font-['Playfair_Display'] text-2xl mt-5">
                {category}
              </h2>

              <p className="text-sm text-[#777467] mt-2">
                Explore your saved learning material.
              </p>

              <p className="text-xs text-[#999386] mt-6">
                Knowledge category
              </p>
            </div>
          )
        )}
      </div>

      {/* =========================
          UPLOADED KNOWLEDGE
      ========================= */}

      <div className="mt-12">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#777467]">
              Your library
            </p>

            <h2 className="font-['Playfair_Display'] text-3xl mt-1">
              Uploaded Knowledge
            </h2>
          </div>

          <span className="text-xs text-[#999386]">
            {files.length}{" "}
            {files.length === 1
              ? "file"
              : "files"}
          </span>
        </div>

        {filteredFiles.length ===
        0 ? (
          <div className="bg-white/60 border border-white rounded-3xl p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-[#e8dfd1] flex items-center justify-center mx-auto">
              <FileText size={22} />
            </div>

            <h3 className="font-['Playfair_Display'] text-2xl mt-5">
              No files uploaded yet.
            </h3>

            <p className="text-sm text-[#777467] mt-2">
              Upload your study material and let DELYRA analyze it.
            </p>

            <button
              type="button"
              onClick={() => {
                setError("");
                setShowUpload(true);
              }}
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25251d] text-white text-sm hover:scale-105 transition"
            >
              <Upload size={16} />
              Upload File
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredFiles.map(
              (file) => (
                <div
                  key={file.id}
                  className={`bg-white/60 border rounded-3xl p-6 transition ${
                    selectedFile?.id ===
                    file.id
                      ? "border-[#8b9276] shadow-md"
                      : "border-white"
                  }`}
                >
                  {/* FILE HEADER */}

                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        selectFile(file)
                      }
                      className="w-11 h-11 rounded-2xl bg-[#e8dfd1] flex items-center justify-center"
                    >
                      <FileText size={20} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteFile(
                          file.id
                        )
                      }
                      className="p-2 rounded-full text-[#999386] hover:text-red-600 hover:bg-red-50 transition"
                      title="Remove file"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* FILE NAME */}

                  <h3 className="font-medium mt-5 truncate">
                    {file.name}
                  </h3>

                  {/* FILE INFO */}

                  <p className="text-xs text-[#999386] mt-2">
                    {formatFileSize(
                      file.size
                    )}
                    {" • "}
                    {file.isPdf
                      ? "PDF"
                      : "Document"}
                  </p>

                  {/* SUCCESS */}

                  {!file.extractionError && (
                    <div className="flex items-center gap-2 mt-4 text-xs text-[#6f785f]">
                      <CheckCircle2
                        size={14}
                      />
                      File ready
                    </div>
                  )}

                  {/* PDF WARNING */}

                  {file.extractionError && (
                    <p className="text-xs text-[#9a6b48] mt-4 leading-5">
                      {
                        file.extractionError
                      }
                    </p>
                  )}

                  {/* SAVED ANALYSIS */}

                  {file.analysis && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-[#6f785f]">
                      <CheckCircle2
                        size={14}
                      />
                      Analysis saved
                    </div>
                  )}

                  {/* ANALYZE */}

                  <button
                    type="button"
                    onClick={() =>
                      analyzeFile(file)
                    }
                    disabled={
                      analyzing ||
                      !file.content.trim()
                    }
                    className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#8b9276] text-white text-sm hover:bg-[#777f64] transition disabled:opacity-40"
                  >
                    {analyzing &&
                    selectedFile?.id ===
                      file.id ? (
                      <>
                        <LoaderCircle
                          size={16}
                          className="animate-spin"
                        />
                        DELYRA is analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles
                          size={16}
                        />
                        Analyze with DELYRA
                      </>
                    )}
                  </button>

                  {/* VIEW SAVED ANALYSIS */}

                  {file.analysis && (
                    <button
                      type="button"
                      onClick={() =>
                        selectFile(file)
                      }
                      className="mt-3 w-full px-4 py-2.5 rounded-2xl bg-white/70 border border-white text-sm hover:bg-white transition"
                    >
                      View Analysis
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* =========================
          ANALYSIS
      ========================= */}

      {(analyzing || analysis) &&
        selectedFile && (
          <div className="mt-10 bg-[#ded8c9]/60 border border-white/70 rounded-3xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#777467]">
                  DELYRA Analysis
                </p>

                <h2 className="font-['Playfair_Display'] text-3xl mt-2">
                  {selectedFile.name}
                </h2>
              </div>

              <Sparkles
                size={22}
                className="text-[#777467]"
              />
            </div>

            {analyzing ? (
              <div className="flex items-center gap-3 mt-7 text-sm text-[#777467]">
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />

                DELYRA is reading and analyzing your file...
              </div>
            ) : (
              <div className="mt-7 whitespace-pre-wrap text-sm leading-7 text-[#555247]">
                {analysis}
              </div>
            )}
          </div>
        )}

      {/* =========================
          UPLOAD MODAL
      ========================= */}

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#f8f5ee] border border-white rounded-3xl p-6 sm:p-8 shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#777467]">
                  Knowledge
                </p>

                <h2 className="font-['Playfair_Display'] text-3xl mt-1">
                  Add Knowledge
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!uploading) {
                    setShowUpload(
                      false
                    );
                    setError("");
                  }
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#e8e2d7] transition disabled:opacity-40"
                disabled={uploading}
              >
                <X size={18} />
              </button>
            </div>

            {/* UPLOAD BOX */}

            <div className="mt-7 border-2 border-dashed border-[#cfc7b8] rounded-3xl p-10 text-center bg-white/20">
              <div className="w-14 h-14 rounded-full bg-[#e8dfd1] flex items-center justify-center mx-auto">
                {uploading ? (
                  <LoaderCircle
                    size={22}
                    className="animate-spin"
                  />
                ) : (
                  <Upload size={22} />
                )}
              </div>

              <h3 className="font-medium mt-5">
                {uploading
                  ? "Reading your file..."
                  : "Upload your learning material"}
              </h3>

              <p className="text-sm text-[#777467] mt-2">
                PDF, TXT, MD, CSV or JSON
              </p>

              <p className="text-xs text-[#999386] mt-2">
                Maximum file size: 25 MB
              </p>

              {/* FILE INPUT */}

              <label
                htmlFor="knowledge-file-upload"
                className={`mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#25251d] text-white text-sm ${
                  uploading
                    ? "opacity-40 cursor-not-allowed"
                    : "cursor-pointer hover:scale-105"
                } transition`}
              >
                {uploading ? (
                  <>
                    <LoaderCircle
                      size={16}
                      className="animate-spin"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Choose File
                  </>
                )}
              </label>

              <input
                id="knowledge-file-upload"
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.md,.csv,.json,application/pdf,text/plain,text/markdown,text/csv,application/json"
                onChange={
                  handleFileUpload
                }
                disabled={uploading}
                className="sr-only"
              />
            </div>

            {/* MODAL ERROR */}

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================
          MOBILE ADD BUTTON
      ========================= */}

      <button
        type="button"
        onClick={() => {
          setError("");
          setShowUpload(true);
        }}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#25251d] text-white flex items-center justify-center shadow-xl"
      >
        <Plus size={21} />
      </button>
    </div>
  );
}

export default Knowledge;