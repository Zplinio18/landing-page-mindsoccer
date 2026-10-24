import { useEffect, useRef, useState } from "react";
import { FaArrowRight, FaBars, FaTimes } from "react-icons/fa";

const links = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "O treinador" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#treinamentos", label: "Personalizado" },
  { href: "#treinamento-mental", label: "Mental" },
];

export default function HomeNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButton.current?.focus();
      }
    }
    function closeOnOutsideClick(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !navigation.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [isOpen]);

  return (
    <nav
      ref={navigation}
      aria-label="Navegação principal"
      className="fixed right-4 top-4 z-[60] font-exo2 laptop:right-7 laptop:top-6"
    >
      <button
        type="button"
        ref={menuButton}
        aria-expanded={isOpen}
        aria-controls="home-navigation-menu"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        onClick={() => setIsOpen((previous) => !previous)}
        className={`ml-auto grid h-11 w-11 place-items-center rounded-full border text-sm text-slate-200 backdrop-blur-md transition-colors hover:border-white/25 hover:bg-[#071222]/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 motion-reduce:transition-none laptop:h-12 laptop:w-12 ${isOpen ? "border-white/20 bg-[#071222]/85" : "border-white/10 bg-[#071222]/25"}`}
      >
        {isOpen ? (
          <FaTimes aria-hidden="true" />
        ) : (
          <FaBars aria-hidden="true" />
        )}
      </button>
      <div
        id="home-navigation-menu"
        aria-hidden={!isOpen}
        ref={(element) => {
          element?.toggleAttribute("inert", !isOpen);
        }}
        className={`absolute right-0 top-full mt-3 w-[280px] max-w-[calc(100vw-32px)] origin-top-right rounded-2xl border border-white/10 bg-[#071222]/95 p-2 shadow-[0_16px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-[transform,opacity,visibility] duration-200 motion-reduce:transition-none ${isOpen ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-2 scale-95 opacity-0"}`}
      >
        <p className="px-3 pb-3 pt-4 text-[9px] font-medium tracking-[0.18em] text-slate-500">
          EXPLORE A MINDSOCCER
        </p>
        {links.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-4 rounded-xl px-3 py-3.5 text-sm text-slate-200 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 motion-reduce:transition-none"
          >
            <span aria-hidden="true" className="text-[10px] text-blue-400">
              0{index + 1}
            </span>
            {link.label}
            <FaArrowRight
              aria-hidden="true"
              className="ml-auto text-[10px] text-slate-500"
            />
          </a>
        ))}
      </div>
    </nav>
  );
}
