interface SectionHeadingProps {
  label: string;
  title: string;
  description: string;
}

export default function SectionHeading({
  label,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-2 tablet:flex-row tablet:items-end tablet:justify-between tablet:gap-12">
      <div className="min-w-0">
        <p className="mb-4 flex items-center gap-3 font-exo2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400 laptop:text-xs">
          <span
            aria-hidden="true"
            className="h-px w-7 shrink-0 bg-blue-400/60"
          />
          {label}
        </p>
        <h2 className="font-jockey text-4xl leading-[1.1] tracking-[-0.01em] text-white mobile:text-6xl laptop:text-7xl">
          {title}
        </h2>
      </div>
      <p className="max-w-md font-exo2 text-sm leading-[1.85] text-slate-400 tablet:max-w-[340px] laptop:text-base">
        {description}
      </p>
    </div>
  );
}
