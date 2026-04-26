import { useEffect, useRef, useState } from "react";
import { Container } from "../components/base/Container";
import { Text } from "../components/base/Text";
import { FaStar } from "react-icons/fa";
import texts from "../utils/texts";

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const [progress, setProgress] = useState(0);

  const carouselDuration = 6000;

  const filteredTestimonials = texts.testimonials.filter((t) =>
    ["Fabrício", "Andréia", "Sheila"].includes(t.name)
  );

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % filteredTestimonials.length);
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1130;
      if (isMobile && scrollRef.current) {
        const scrollAmount = scrollRef.current.offsetWidth * activeIndex;
        scrollRef.current.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    setProgress(0);
    startTimeRef.current = Date.now();

    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex]);

  useEffect(() => {
    const checkPauseAndScreen = () => {
      const isMobile = window.innerWidth < 1130;
      return isPaused || !isMobile;
    };

    if (checkPauseAndScreen()) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const interval = 50; 
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = (elapsed / carouselDuration) * 100;

      if (newProgress >= 100) {
        nextSlide();
      } else {
        setProgress(newProgress);
      }
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, activeIndex]);

  return (
    <Container.Flex className="w-full flex-col bg-black py-16 px-4 laptop:px-20 overflow-hidden">
      <div className="w-full h-px bg-white/10 mb-8"></div>

      <Container.Flex className="flex-col items-center gap-4 mb-12 animate-slide-left-fade">
        <Text.Title className="text-4xl text-secondary laptop:text-6xl text-center uppercase">
          DEPOIMENTOS DOS <span className="text-white">PAIS E ATLETAS</span>
        </Text.Title>
        <div className="h-1 w-24 bg-secondary"></div>
      </Container.Flex>

      <div className="relative w-full max-w-7xl mx-auto flex flex-col gap-6">
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex tablet:grid tablet:grid-cols-3 gap-8 overflow-x-auto tablet:overflow-x-visible scrollbar-hide snap-x snap-mandatory pb-2"
          style={{ scrollBehavior: "smooth" }}
        >
          {filteredTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="min-w-full tablet:min-w-0 snap-center px-2"
            >
              <Container.Flex
                className="flex-col gap-6 rounded-2xl border-t-4 border-secondary bg-gradient-to-b from-suport-100 to-suport-400 p-8 shadow-[0_0_15px_rgba(0,64,148,0.2)] h-full transition-transform hover:scale-[1.02]"
              >
                <Container.Flex className="gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-xl" />
                  ))}
                </Container.Flex>

                <Text.Default className="text-lg text-white font-exo2 italic leading-relaxed">
                  "{testimonial.content}"
                </Text.Default>

                <Container.Flex className="flex-col gap-1 mt-auto">
                  <Text.Title className="text-xl text-secondary uppercase">
                    {testimonial.name}
                  </Text.Title>
                  <Text.Default className="text-sm text-subtitle font-exo2">
                    Responsável pelo atleta:{" "}
                    <span className="text-white">{testimonial.athlete}</span> (
                    {testimonial.age})
                  </Text.Default>
                </Container.Flex>
              </Container.Flex>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 tablet:hidden">
          <div className="flex justify-center w-full">
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary transition-all duration-75 ease-linear"
                style={{ width: `${100 - progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {filteredTestimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === i ? "w-8 bg-secondary" : "w-2 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </Container.Flex>
  );
}

export default Testimonials;
