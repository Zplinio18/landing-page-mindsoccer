import { Container } from "./components/base/Container";
import AboutMindsoccer from "./sections/aboutmindsoccer";
import CustomTraining from "./sections/customtraining";
import MentalTraining from "./sections/mentaltraining";
import { FaWhatsapp } from "react-icons/fa";

function App() {
  return (
    <Container.Flex className="w-full flex-col">
      <AboutMindsoccer />
      <CustomTraining />
      <MentalTraining />
      <a
        href="https://wa.me/5532984596559?text=Olá%20Lucas%2C%20gostaria%20de%20saber%20mais%20sobre%20a%20metodologia%20Minsoccer!%20⚽"
        target="_blank"
        rel="noreferrer"
        aria-label="Entrar em contato no WhatsApp"
        className="fixed bottom-5 right-4 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-transform hover:scale-105 laptop:h-14 laptop:w-auto laptop:gap-2 laptop:px-5"
      >
        <FaWhatsapp className="h-9 w-9 text-white" />
        <span className="hidden whitespace-nowrap font-exo2 text-xl text-white laptop:inline">
          Entrar em contato!
        </span>
      </a>
    </Container.Flex>
  );
}

export default App;
