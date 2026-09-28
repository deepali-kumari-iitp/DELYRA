import {
  Brain,
  ListChecks,
  Zap,
  Check,
} from "lucide-react";

type AgentActivityProps = {
  steps?: string[];
  completed?: boolean;
};

function AgentActivity({
  steps = [],
  completed = false,
}: AgentActivityProps) {
  const defaultSteps = [
    "Understanding request",
    "Creating plan",
    "Executing tasks",
  ];

  const activitySteps =
    steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="bg-[#ded8c9]/60 border border-white/60 rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-['Playfair_Display'] text-xl">
          Agent Activity
        </h2>

        <span className="text-xs text-[#777467]">
          DELYRA
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {activitySteps.map((step, index) => {
          const Icon =
            index === 0
              ? Brain
              : index === 1
              ? ListChecks
              : Zap;

          return (
            <div
              key={`${step}-${index}`}
              className="flex items-center gap-3 text-sm"
            >
              <div className="w-8 h-8 rounded-full bg-white/70 text-[#777467] flex items-center justify-center shrink-0">
                <Icon size={15} />
              </div>

              <span className="text-[#555247]">
                {step}
              </span>
            </div>
          );
        })}

        {completed && (
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-[#8b9276] text-white flex items-center justify-center shrink-0">
              <Check size={15} />
            </div>

            <span className="text-[#555247]">
              Task completed
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AgentActivity;