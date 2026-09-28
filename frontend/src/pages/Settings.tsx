import { useEffect, useState } from "react";
import {
  User,
  Brain,
  Bell,
  Palette,
  Shield,
  Bot,
  X,
  Save,
} from "lucide-react";

type SettingType =
  | "Profile"
  | "AI Model"
  | "Memory"
  | "Notifications"
  | "Appearance"
  | "Security";

type Preferences = {
  name: string;
  email: string;
  aiModel: string;
  memoryEnabled: boolean;
  notificationsEnabled: boolean;
  appearance: "comfortable" | "compact";
};

const defaultPreferences: Preferences = {
  name: "Deepali",
  email: "",
  aiModel: "Gemini Flash",
  memoryEnabled: true,
  notificationsEnabled: true,
  appearance: "comfortable",
};

const settings = [
  {
    title: "Profile" as SettingType,
    description: "Manage your personal information.",
    icon: User,
  },
  {
    title: "AI Model" as SettingType,
    description: "Choose how DELYRA thinks and responds.",
    icon: Bot,
  },
  {
    title: "Memory" as SettingType,
    description: "Control what DELYRA remembers.",
    icon: Brain,
  },
  {
    title: "Notifications" as SettingType,
    description: "Manage your reminders and alerts.",
    icon: Bell,
  },
  {
    title: "Appearance" as SettingType,
    description: "Customize the look of DELYRA.",
    icon: Palette,
  },
  {
    title: "Security" as SettingType,
    description: "Manage account and privacy settings.",
    icon: Shield,
  },
];

function Settings() {
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);

  const [activeSetting, setActiveSetting] =
    useState<SettingType | null>(null);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedPreferences =
      localStorage.getItem("delyra-settings");

    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch {
        localStorage.removeItem("delyra-settings");
      }
    }
  }, []);

  const updatePreference = <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveSettings = () => {
    localStorage.setItem(
      "delyra-settings",
      JSON.stringify(preferences)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const renderSettingContent = () => {
    switch (activeSetting) {
      case "Profile":
        return (
          <>
            <p className="text-sm text-[#777467] mb-6">
              Update the information DELYRA uses for your workspace.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#777467]">
                  Name
                </label>

                <input
                  value={preferences.name}
                  onChange={(e) =>
                    updatePreference("name", e.target.value)
                  }
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-[#f5f0e8] border border-white outline-none text-sm"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-xs text-[#777467]">
                  Email
                </label>

                <input
                  type="email"
                  value={preferences.email}
                  onChange={(e) =>
                    updatePreference("email", e.target.value)
                  }
                  className="w-full mt-2 px-4 py-3 rounded-xl bg-[#f5f0e8] border border-white outline-none text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </>
        );

      case "AI Model":
        return (
          <>
            <p className="text-sm text-[#777467] mb-6">
              Choose the AI model preference for DELYRA.
            </p>

            <div className="space-y-3">
              {[
                {
                  name: "Gemini Flash",
                  description:
                    "Fast responses for everyday tasks.",
                },
                {
                  name: "Gemini Pro",
                  description:
                    "More detailed reasoning for complex tasks.",
                },
              ].map((model) => (
                <button
                  key={model.name}
                  onClick={() =>
                    updatePreference("aiModel", model.name)
                  }
                  className={`w-full text-left p-4 rounded-2xl border transition ${
                    preferences.aiModel === model.name
                      ? "bg-[#d9e0d2] border-[#8b9276]"
                      : "bg-[#f5f0e8] border-white hover:bg-[#eee9df]"
                  }`}
                >
                  <p className="text-sm font-medium">
                    {model.name}
                  </p>

                  <p className="text-xs text-[#777467] mt-1">
                    {model.description}
                  </p>
                </button>
              ))}
            </div>
          </>
        );

      case "Memory":
        return (
          <>
            <p className="text-sm text-[#777467] mb-6">
              Control whether DELYRA can remember information
              from your conversations.
            </p>

            <div className="flex items-center justify-between bg-[#f5f0e8] rounded-2xl p-5">
              <div>
                <p className="text-sm font-medium">
                  Persistent Memory
                </p>

                <p className="text-xs text-[#777467] mt-1">
                  Allow DELYRA to remember useful information.
                </p>
              </div>

              <button
                onClick={() =>
                  updatePreference(
                    "memoryEnabled",
                    !preferences.memoryEnabled
                  )
                }
                className={`w-12 h-7 rounded-full p-1 transition ${
                  preferences.memoryEnabled
                    ? "bg-[#8b9276]"
                    : "bg-[#c8c3b8]"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition ${
                    preferences.memoryEnabled
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </>
        );

      case "Notifications":
        return (
          <>
            <p className="text-sm text-[#777467] mb-6">
              Manage DELYRA reminders and notifications.
            </p>

            <div className="flex items-center justify-between bg-[#f5f0e8] rounded-2xl p-5">
              <div>
                <p className="text-sm font-medium">
                  Notifications
                </p>

                <p className="text-xs text-[#777467] mt-1">
                  Receive reminders and important alerts.
                </p>
              </div>

              <button
                onClick={() =>
                  updatePreference(
                    "notificationsEnabled",
                    !preferences.notificationsEnabled
                  )
                }
                className={`w-12 h-7 rounded-full p-1 transition ${
                  preferences.notificationsEnabled
                    ? "bg-[#8b9276]"
                    : "bg-[#c8c3b8]"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition ${
                    preferences.notificationsEnabled
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </>
        );

      case "Appearance":
        return (
          <>
            <p className="text-sm text-[#777467] mb-6">
              Choose how comfortable you want the workspace
              layout to feel.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  value: "comfortable" as const,
                  label: "Comfortable",
                },
                {
                  value: "compact" as const,
                  label: "Compact",
                },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    updatePreference(
                      "appearance",
                      option.value
                    )
                  }
                  className={`p-5 rounded-2xl border text-sm transition ${
                    preferences.appearance === option.value
                      ? "bg-[#d9e0d2] border-[#8b9276]"
                      : "bg-[#f5f0e8] border-white hover:bg-[#eee9df]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        );

      case "Security":
        return (
          <>
            <p className="text-sm text-[#777467] mb-6">
              Your DELYRA workspace currently uses local
              browser preferences for these settings.
            </p>

            <div className="space-y-3">
              <div className="p-5 rounded-2xl bg-[#f5f0e8]">
                <p className="text-sm font-medium">
                  Local Settings
                </p>

                <p className="text-xs text-[#777467] mt-1">
                  Your preferences are stored in this browser.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#f5f0e8]">
                <p className="text-sm font-medium">
                  Backend Access
                </p>

                <p className="text-xs text-[#777467] mt-1">
                  DELYRA communicates with your local backend
                  through protected API routes.
                </p>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen px-6 lg:px-10 py-10">
      <p className="text-xs uppercase tracking-widest text-[#777467]">
        Preferences
      </p>

      <h1 className="font-['Playfair_Display'] text-5xl mt-2">
        Settings
      </h1>

      <p className="text-sm text-[#777467] mt-3">
        Make DELYRA work the way you want.
      </p>

      <div className="max-w-4xl mt-10 space-y-3">
        {settings.map((setting) => {
          const Icon = setting.icon;

          return (
            <button
              key={setting.title}
              onClick={() =>
                setActiveSetting(setting.title)
              }
              className="w-full flex items-center gap-5 text-left bg-white/60 border border-white rounded-2xl p-5 hover:bg-white/80 transition"
            >
              <div className="w-11 h-11 rounded-xl bg-[#e8dfd1] flex items-center justify-center shrink-0">
                <Icon size={19} />
              </div>

              <div>
                <h2 className="text-sm font-medium">
                  {setting.title}
                </h2>

                <p className="text-xs text-[#777467] mt-1">
                  {setting.description}
                </p>
              </div>

              <span className="ml-auto text-[#999386]">
                →
              </span>
            </button>
          );
        })}
      </div>

      {/* SETTINGS MODAL */}
      {activeSetting && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-lg bg-[#f8f3eb] rounded-3xl shadow-xl border border-white p-7">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#777467]">
                  Preferences
                </p>

                <h2 className="font-['Playfair_Display'] text-3xl mt-1">
                  {activeSetting}
                </h2>
              </div>

              <button
                onClick={() => setActiveSetting(null)}
                className="w-9 h-9 rounded-full hover:bg-[#e8dfd1] flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-7">
              {renderSettingContent()}
            </div>

            <div className="flex items-center justify-end gap-3 mt-8">
              <button
                onClick={() => setActiveSetting(null)}
                className="px-5 py-3 rounded-full bg-white text-sm hover:bg-[#eee9df] transition"
              >
                Close
              </button>

              <button
                onClick={saveSettings}
                className="px-5 py-3 rounded-full bg-[#25251d] text-white text-sm flex items-center gap-2 hover:scale-[1.02] transition"
              >
                <Save size={15} />
                Save
              </button>
            </div>

            {saved && (
              <p className="text-xs text-[#687154] text-right mt-3">
                Settings saved successfully ✓
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;