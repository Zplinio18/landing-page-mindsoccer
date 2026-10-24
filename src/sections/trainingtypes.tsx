import SectionSeparator from "../components/ui/section-separator";
import { Container } from "../components/base/Container";
import SectionHeading from "../components/ui/section-heading";

function TrainingTypes() {
  return (
    <Container.Flex
      id="treinamentos"
      tabIndex={-1}
      className="w-full scroll-mt-28 flex-col bg-black px-4 tablet:pb-16 laptop:px-20 laptop:pb-6"
    >
      <SectionSeparator className="mb-8" />

      <SectionHeading
        label="Metodologia MindSoccer"
        title="Meus treinamentos"
        description="Técnica, visão de jogo e mentalidade. Um trabalho voltado à evolução de cada atleta."
      />
    </Container.Flex>
  );
}

export default TrainingTypes;
