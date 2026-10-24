import SectionSeparator from "../components/ui/section-separator";
import { useId, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import texts from "../utils/texts";

const [methodology, ...story] = texts.mindsoccer.text.split("/n/n");

export default function CoachStory() {
  const [isOpen, setIsOpen] = useState(false);
  const storyId = useId();
  const toggleId = useId();
  return (
    <section
      id="sobre"
      tabIndex={-1}
      aria-labelledby="coach-story-title"
      className="relative z-20 w-full scroll-mt-28 bg-transparent px-4 pb-8 pt-8 laptop:px-20 laptop:pb-12"
    >
      <SectionSeparator className="mb-12 laptop:mb-16" />
      <div className="mx-auto grid max-w-7xl gap-8 px-2 tablet:grid-cols-[1fr_1.5fr] tablet:gap-16">
        <div>
          <span className="font-exo2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Lucas Garcia · MindSoccer
          </span>
          <h2
            id="coach-story-title"
            className="mt-4 font-jockey text-4xl leading-tight text-white laptop:text-5xl"
          >
            Conheça o treinador
          </h2>
          <div className="mt-5 h-1 w-16 rounded-full bg-secondary" />
        </div>
        <div className="min-w-0">
          <p className="font-exo2 text-base leading-relaxed text-slate-300 laptop:text-lg">
            {methodology}
          </p>
          <div
            className={`relative isolate mt-6 rounded-2xl border bg-gradient-to-b from-suport-100/60 to-black transition-colors duration-500 motion-reduce:transition-none ${isOpen ? "border-blue-400" : "border-white/10"}`}
          >
            <button
              id={toggleId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={storyId}
              onClick={() => setIsOpen((previous) => !previous)}
              className="relative flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl px-5 py-5 text-left font-exo2 text-base font-semibold text-blue-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 motion-reduce:transition-none"
            >
              {isOpen ? "Recolher minha história" : "Ler minha história"}
              <FaChevronDown
                aria-hidden="true"
                className={`shrink-0 text-xs transition-transform duration-500 ease-in-out motion-reduce:transition-none ${isOpen ? "rotate-180" : "rotate-0"}`}
              />
            </button>
            <div
              id={storyId}
              role="region"
              aria-labelledby={toggleId}
              aria-hidden={!isOpen}
              className={`relative grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="space-y-5 px-5 pb-6 font-exo2 text-base leading-relaxed text-slate-300 laptop:text-lg">
                  {story.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
