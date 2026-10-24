import { CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function Toaster() {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`glass pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium ${t.leaving ? "animate-toast-out" : "animate-fade-up"}`}>
          <CheckCircle2 className="size-4 text-primary" aria-hidden />
          {t.message}
        </div>
      ))}
    </div>
  );
}
