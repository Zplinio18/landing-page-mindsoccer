import { useEffect, useRef, useState } from "react";
import { FaQuoteLeft, FaStar, FaRedo } from "react-icons/fa";
import SectionHeading from "../components/ui/section-heading";
import SectionSeparator from "../components/ui/section-separator";
import { readTestimonials } from "../lib/testimonials";
import type { Testimonial } from "../lib/testimonials";

const cardClass =
  "relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e1521] to-[#06090f] p-6 laptop:p-8";

function TestimonialsSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto w-full max-w-7xl px-2"
    >
      <span className="sr-only">Carregando depoimentos de pais e atletas…</span>
      <div
        aria-hidden="true"
        className="grid grid-cols-1 gap-6 tablet:grid-cols-3"
      >
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`${cardClass} ${index > 0 ? "hidden tablet:flex" : ""}`}
          >
            <div className="pointer-events-none absolute inset-0 animate-testimonial-shimmer bg-gradient-to-r from-transparent via-blue-200/[0.06] to-transparent motion-reduce:hidden" />
            <div className="mb-7 flex items-center justify-between">
              <div className="h-2 w-24 rounded-full bg-white/[0.07]" />
              <FaQuoteLeft className="text-2xl text-secondary/30" />
            </div>
            <div className="mb-6 flex gap-1 text-xs text-amber-200/20">
              {[0, 1, 2, 3, 4].map((star) => (
                <FaStar key={star} />
              ))}
            </div>
            <div className="space-y-3.5">
              {["w-full", "w-[92%]", "w-full", "w-3/4", "w-1/2"].map(
                (width, index) => (
                  <div
                    key={index}
                    className={`h-3 rounded-full bg-white/[0.07] ${width}`}
                  />
                ),
              )}
            </div>
            <div className="mt-auto flex items-center gap-3 border-t border-white/[0.07] pt-5">
              <div className="h-10 w-10 rounded-full bg-secondary/20" />
              <div className="flex-1 space-y-3">
                <div className="h-3 w-1/3 rounded-full bg-white/10" />
                <div className="h-2 w-2/3 rounded-full bg-white/[0.06]" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <p
        aria-hidden="true"
        className="mt-6 text-center font-exo2 text-xs tracking-wide text-slate-500"
      >
        Carregando histórias de evolução…
      </p>
    </div>
  );
}

function Testimonials() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1130);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [isInteracting, setIsInteracting] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const paused = isInteracting || hasFocus || !isVisible;

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    setIsLoading(true);
    setLoadError(false);
    readTestimonials(controller.signal)
      .then((items) => {
        if (mounted) {
          setTestimonials(items);
          setActiveIndex(0);
        }
      })
      .catch(() => {
        if (mounted && !controller.signal.aborted) setLoadError(true);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [reloadKey]);

  useEffect(() => {
    if (!loadError) return;
    const retryOnReconnect = () => setReloadKey((previous) => previous + 1);
    const retryOnRestore = (event: PageTransitionEvent) => {
      if (event.persisted) retryOnReconnect();
    };
    window.addEventListener("online", retryOnReconnect);
    window.addEventListener("pageshow", retryOnRestore);
    return () => {
      window.removeEventListener("online", retryOnReconnect);
      window.removeEventListener("pageshow", retryOnRestore);
    };
  }, [loadError]);

  useEffect(() => {
    const viewport = window.matchMedia("(max-width: 1129px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateViewport = () => setIsMobile(viewport.matches);
    const updateMotion = () => setReducedMotion(motion.matches);
    viewport.addEventListener("change", updateViewport);
    motion.addEventListener("change", updateMotion);
    return () => {
      viewport.removeEventListener("change", updateViewport);
      motion.removeEventListener("change", updateMotion);
    };
  }, []);

  useEffect(() => {
    const releaseMouse = (event: PointerEvent) => {
      if (event.pointerType === "mouse") setIsInteracting(false);
    };
    const releaseOnBlur = () => setIsInteracting(false);
    window.addEventListener("pointerup", releaseMouse);
    window.addEventListener("pointercancel", releaseMouse);
    window.addEventListener("blur", releaseOnBlur);
    return () => {
      window.removeEventListener("pointerup", releaseMouse);
      window.removeEventListener("pointercancel", releaseMouse);
      window.removeEventListener("blur", releaseOnBlur);
    };
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(carousel);
    return () => observer.disconnect();
  }, [isLoading]);

  function select(index: number) {
    if (testimonials.length > 0)
      setActiveIndex((index + testimonials.length) % testimonials.length);
  }

  if (!isLoading && !loadError && testimonials.length === 0) return null;

  return (
    <section
      aria-label="Depoimentos de pais e atletas"
      className="w-full overflow-hidden bg-black px-4 py-16 laptop:px-20"
    >
      <SectionSeparator className="mb-8" />
      <div className="mb-10 laptop:mb-12">
        <SectionHeading
          label="Pais e atletas"
          title="Depoimentos"
          description="A experiência de quem faz parte dessa evolução, dentro e fora de campo."
        />
      </div>
      {isLoading ? (
        <TestimonialsSkeleton />
      ) : loadError ? (
        <div className="mx-auto w-full max-w-7xl px-2">
          <div className="flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-[#0e1521] p-6 font-exo2 tablet:flex-row tablet:items-center tablet:justify-between laptop:p-8">
            <div role="status">
              <p className="text-base font-medium text-slate-200">
                Não foi possível carregar os depoimentos agora.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Você pode tentar novamente sem sair da página.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReloadKey((previous) => previous + 1)}
              className="inline-flex shrink-0 items-center gap-2.5 rounded-lg border border-secondary/50 bg-secondary/15 px-4 py-3 text-sm text-slate-200 transition-colors hover:bg-secondary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 motion-reduce:transition-none"
            >
              <FaRedo aria-hidden="true" className="text-xs" />
              Tentar novamente
            </button>
          </div>
        </div>
      ) : (
        <div
          ref={carouselRef}
          role="group"
          aria-roledescription="carrossel"
          aria-label="Experiências com a MindSoccer"
          tabIndex={0}
          aria-describedby="testimonials-navigation-hint"
          className="mx-auto w-full max-w-7xl select-none px-2 [-webkit-touch-callout:none] focus-visible:rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
          onPointerDown={(event) => {
            if (event.pointerType === "mouse" && event.button === 0) {
              setHasFocus(false);
              setIsInteracting(true);
            }
          }}
          onFocusCapture={(event) =>
            setHasFocus(event.target.matches(":focus-visible"))
          }
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setHasFocus(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              select(activeIndex + 1);
            }
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              select(activeIndex - 1);
            }
          }}
        >
          <p id="testimonials-navigation-hint" className="sr-only">
            {isMobile
              ? "Deslize para os lados ou use as setas do teclado para trocar de depoimento. Segure o card para pausar."
              : "O depoimento em destaque aparece no centro. Clique nos cards laterais ou use as setas do teclado para trocar. Mantenha o botão do mouse pressionado sobre um card para pausar."}
          </p>
          <div
            className="touch-pan-y overflow-hidden py-2 tablet:py-8"
            onContextMenu={(event) => event.preventDefault()}
            onTouchStart={(event) => {
              const touch = event.touches[0];
              touchStart.current = { x: touch.clientX, y: touch.clientY };
              setIsInteracting(true);
            }}
            onTouchEnd={(event) => {
              const touch = event.changedTouches[0];
              const start = touchStart.current;
              if (isMobile && start) {
                const dx = touch.clientX - start.x;
                const dy = touch.clientY - start.y;
                if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy))
                  select(activeIndex + (dx < 0 ? 1 : -1));
              }
              touchStart.current = null;
              setIsInteracting(false);
            }}
            onTouchCancel={() => {
              touchStart.current = null;
              setIsInteracting(false);
            }}
          >
            <div
              className="flex items-stretch gap-6 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none tablet:grid tablet:grid-cols-1"
              style={{
                transform: isMobile
                  ? `translateX(calc(-${activeIndex} * (100% + 24px)))`
                  : undefined,
              }}
            >
              {testimonials.map((testimonial, index) => {
                let offset =
                  (index - activeIndex + testimonials.length) %
                  testimonials.length;
                if (offset > testimonials.length / 2)
                  offset -= testimonials.length;
                const isActive = index === activeIndex;
                const isNeighbor = Math.abs(offset) === 1;
                return (
                  <article
                    key={testimonial.id}
                    aria-label={`${index + 1} de ${testimonials.length}: ${testimonial.author}`}
                    aria-hidden={
                      (isMobile ? !isActive : !isActive && !isNeighbor)
                        ? true
                        : undefined
                    }
                    aria-current={isActive ? "true" : undefined}
                    className={`${cardClass} isolate w-full min-w-0 shrink-0 font-exo2 transition-[transform,opacity,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none tablet:col-start-1 tablet:row-start-1 tablet:w-[42%] tablet:max-w-[560px] tablet:justify-self-center ${!isMobile && isActive ? "border-secondary/60 shadow-[0_20px_60px_rgba(0,0,0,0.4)]" : ""}`}
                    style={
                      isMobile
                        ? undefined
                        : {
                            transform: `translateX(${isActive ? 0 : Math.sign(offset) * (isNeighbor ? 78 : 125)}%) scale(${isActive ? 1 : isNeighbor ? 0.82 : 0.72})`,
                            opacity: isActive ? 1 : isNeighbor ? 0.45 : 0,
                            zIndex: isActive ? 20 : isNeighbor ? 10 : 0,
                            pointerEvents:
                              isActive || isNeighbor ? "auto" : "none",
                          }
                    }
                  >
                    {!isMobile && !isActive && isNeighbor && (
                      <button
                        type="button"
                        aria-label={`Destacar depoimento de ${testimonial.author}`}
                        onClick={() => select(index)}
                        className="absolute inset-0 z-10 cursor-pointer rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-400"
                      />
                    )}
                    <span
                      key={`${testimonial.id}-${isActive}-${reducedMotion}`}
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[15px] motion-reduce:hidden"
                    >
                      <span
                        className="absolute left-1/2 top-1/2 aspect-square w-[220%] animate-testimonial-border bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,#004094_310deg,#3b82f6_340deg,#93c5fd_355deg,transparent_360deg)]"
                        style={{
                          animationPlayState:
                            paused || !isActive ? "paused" : "running",
                        }}
                      />
                      <span className="absolute inset-px rounded-[14px] bg-gradient-to-b from-[#0e1521] to-[#06090f]" />
                    </span>
                    <div className="mb-7 flex items-center justify-between gap-4">
                      <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-slate-500">
                        <span className="mr-3 text-secondary">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        Uma história de evolução
                      </span>
                      <FaQuoteLeft
                        aria-hidden="true"
                        className="shrink-0 text-2xl text-secondary/50"
                      />
                    </div>
                    <div
                      aria-label={`${testimonial.rating} de 5 estrelas`}
                      className="mb-5 flex gap-1 text-[11px] text-[#d5b477]"
                    >
                      {Array.from({ length: testimonial.rating }, (_, star) => (
                        <FaStar aria-hidden="true" key={star} />
                      ))}
                    </div>
                    <blockquote className="mb-8 flex-1 whitespace-pre-wrap break-words text-base leading-[1.85] text-slate-200">
                      {testimonial.content}
                    </blockquote>
                    <footer className="flex items-center gap-3 border-t border-white/[0.07] pt-5">
                      <span
                        aria-hidden="true"
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-secondary/30 bg-secondary/15 text-xs font-semibold text-slate-300"
                      >
                        {testimonial.author
                          .trim()
                          .split(/\s+/)
                          .slice(0, 2)
                          .map((name) => name[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold text-white">
                          {testimonial.author}
                        </p>
                        <p className="mt-1 break-words text-xs leading-relaxed text-slate-500">
                          {testimonial.isAdult ? (
                            "Atleta MindSoccer"
                          ) : (
                            <>
                              Responsável por{" "}
                              <span className="text-slate-400">
                                {testimonial.athlete}
                              </span>{" "}
                              ·{" "}
                              {String(testimonial.age).includes("anos")
                                ? testimonial.age
                                : `${testimonial.age} anos`}
                            </>
                          )}
                        </p>
                      </div>
                    </footer>
                  </article>
                );
              })}
            </div>
          </div>
          {testimonials.length > 1 && (
            <div className="mt-4 tablet:mx-auto tablet:max-w-sm">
              <div className="flex gap-2" aria-hidden="true">
                {testimonials.map((testimonial, index) => (
                  <span
                    key={testimonial.id}
                    className="flex h-8 min-w-0 flex-1 items-center"
                    aria-hidden="true"
                  >
                    <span className="relative block h-0.5 w-full overflow-hidden rounded-full bg-white/10">
                      {index === activeIndex && (
                        <span
                          key={`${testimonial.id}-${reducedMotion}`}
                          onAnimationEnd={() => {
                            if (!paused && !reducedMotion)
                              select(activeIndex + 1);
                          }}
                          className={`absolute inset-0 origin-left rounded-full bg-secondary ${reducedMotion ? "" : "animate-testimonial-progress"}`}
                          style={{
                            animationPlayState: paused ? "paused" : "running",
                          }}
                        />
                      )}
                    </span>
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between gap-4">
                <p
                  aria-live="off"
                  className="font-exo2 text-[11px] tracking-[0.14em] text-slate-500"
                >
                  <span className="text-slate-200">
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="mx-2 text-slate-700">/</span>
                  {String(testimonials.length).padStart(2, "0")}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Testimonials;
