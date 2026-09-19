import React, { useState } from "react";
import { WifiOff, Database, CheckCircle2, ChevronRight, X } from "lucide-react";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  if (isOnline || dismissed) return null;

  return (
    <aside
      aria-label="Offline status banner"
      className="fixed bottom-4 right-4 z-50 max-w-sm rounded-2xl bg-amber-500 text-white p-3.5 shadow-xl border border-amber-400 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="w-8 h-8 rounded-xl bg-amber-600/60 flex items-center justify-center shrink-0 mt-0.5">
        <WifiOff className="w-4 h-4 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-bold font-['Outfit',sans-serif]">
            Offline Mode Active
          </h4>
          <button
            onClick={() => setDismissed(true)}
            className="text-amber-100 hover:text-white p-0.5 rounded cursor-pointer"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[11px] text-amber-100 mt-0.5 leading-snug">
          Service worker is serving cached learning resources. Your dashboard stats, revision schedule, and flashcards remain fully interactive.
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold bg-amber-600/50 px-2 py-0.5 rounded-md w-fit">
          <Database className="w-3 h-3 text-amber-200" />
          <span>Local Cache Synced</span>
        </div>
      </div>
    </aside>
  );
};
