import { Container } from "../components/base/Container";
import mindSoccerImg from "../assets/images/mindsoccer.png";
import logoImg from "../assets/images/logo.png";
import texts from "../utils/texts";
import { FaWhatsapp, FaArrowRight } from "react-icons/fa";

function AboutMindsoccer() {
  return (
    <Container.Flex
      id="inicio"
      tabIndex={-1}
      className="relative h-auto scroll-mt-0 flex-col-reverse justify-between gap-4 bg-gradient-to-b from-primary to-black px-2 pb-14 pt-8 [--anim-duration:650ms] laptop:h-screen laptop:flex-row laptop:pt-0"
    >
      <Container.Flex
        className="pointer-events-none absolute inset-x-0 top-0 h-[80dvh] w-full bg-cover bg-center opacity-45 laptop:pointer-events-auto laptop:static laptop:h-screen laptop:w-[70%] laptop:opacity-100"
        style={{
          backgroundImage: `url(${mindSoccerImg})`,
        }}
      >
        <></>
      </Container.Flex>
      <Container.Flex className="relative z-10 flex-col justify-center gap-7 px-4 pt-8 laptop:h-screen laptop:w-[80vw] laptop:gap-10 laptop:pt-12">
        <Container.Flex
          className="animate-slide-left-fade h-[88px] w-[250px] bg-cover bg-center laptop:h-[100px] laptop:w-[300px]"
          style={{
            backgroundImage: `url(${logoImg})`,
          }}
        >
          <></>
        </Container.Flex>
        <div className="animate-slide-left-fade max-w-3xl">
          <div className="mb-5 flex items-center gap-3 font-exo2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300 laptop:text-xs">
            <span className="text-blue-400">MindSoccer</span>
            <span aria-hidden="true" className="h-px w-7 bg-blue-400/40" />
            Técnica, tática e mentalidade
          </div>
          <h1 className="font-jockey text-[clamp(2.5rem,10.5vw,3.5rem)] leading-[1.08] text-white laptop:text-6xl laptop:leading-tight">
            {texts.mindsoccer.title}{" "}
            <span className="text-secondary">Mais confiança para jogar.</span>
          </h1>
        </div>
        <p className="animate-slide-right-fade max-w-2xl border-l-2 border-secondary/70 pl-5 font-exo2 text-base leading-[1.85] text-slate-300 laptop:text-xl">
          {texts.mindsoccer.description}
        </p>
        <div className="animate-slide-left-fade flex flex-col items-start gap-4">
          <a
            href="https://wa.me/5532984596559?text=Olá%20Lucas%2C%20gostaria%20de%20saber%20mais%20sobre%20a%20metodologia%20Minsoccer!%20⚽"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-secondary to-suport-200 px-5 py-4 font-exo2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 motion-reduce:transition-none min-[480px]:w-auto laptop:text-xl"
          >
            <FaWhatsapp className="shrink-0 text-2xl" />
            Conversar com o treinador
            <FaArrowRight className="shrink-0 text-sm" />
          </a>
          <p className="max-w-lg font-exo2 text-xs leading-relaxed text-slate-400 laptop:text-base laptop:text-slate-300">
            Uma metodologia própria para buscar a evolução de cada atleta.
          </p>
        </div>
      </Container.Flex>
    </Container.Flex>
  );
}

export default AboutMindsoccer;
