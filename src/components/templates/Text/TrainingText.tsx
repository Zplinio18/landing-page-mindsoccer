interface TrainingTextProps {
  title: string;
  subtitle: string;
  text: string;
  number: string;
}

export default function TrainingText({
  title,
  subtitle,
  text,
  number,
}: TrainingTextProps) {
  const [introduction, ...paragraphs] = text.split("/n/n");

  return (
    <article className="mx-auto w-full min-w-0 max-w-[680px] px-2 py-6 laptop:px-0 laptop:py-10">
      <div className="mb-6 flex items-center gap-3 font-exo2 text-xs uppercase tracking-[0.16em]">
        <span className="text-blue-400">{number}</span>
        <span aria-hidden="true" className="h-px w-8 bg-blue-400/40" />
        <span className="text-slate-400">{subtitle}</span>
      </div>
      <h3 className="max-w-lg font-jockey text-4xl leading-tight text-white laptop:text-[42px]">
        {title}
      </h3>
      <p className="mt-7 font-exo2 text-lg leading-[1.85] text-slate-200 laptop:text-xl">
        {introduction}
      </p>
      {paragraphs.length > 0 && (
        <div className="mt-8 space-y-5 border-l-2 border-secondary/70 pl-5 font-exo2 text-base leading-[1.85] text-slate-400 laptop:text-lg">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}
    </article>
  );
}
