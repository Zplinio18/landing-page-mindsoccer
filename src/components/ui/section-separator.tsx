import { cn } from "../../lib/utils";

interface SectionSeparatorProps {
  className?: string;
}

export default function SectionSeparator({ className }: SectionSeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn("flex h-3 w-full items-center gap-5", className)}
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-blue-400/40" />
      <span className="h-1.5 w-1.5 shrink-0 rotate-45 rounded-[1px] border border-blue-300/70 bg-blue-400/20 shadow-[0_0_12px_rgba(96,165,250,0.25)]" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-blue-400/40" />
    </div>
  );
}
