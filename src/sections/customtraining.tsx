import SectionSeparator from "../components/ui/section-separator";
import { Container } from "../components/base/Container";
import CustomTrainingImg from "../assets/images/customtraining.png";
import TrainingText from "../components/templates/Text/TrainingText";
import texts from "../utils/texts";

function CustomTraining() {
  return (
    <section
      id="treinamento-personalizado"
      tabIndex={-1}
      aria-labelledby="personalized-training-title"
      className="flex w-full scroll-mt-28 flex-col bg-black px-4 pt-8 laptop:px-20"
    >
      <SectionSeparator className="mb-4 laptop:mb-0" />
      <Container.Flex className="relative h-auto flex-col justify-between py-8 laptop:h-screen laptop:flex-row laptop:gap-4 laptop:py-0">
        <Container.Flex className="relative z-10 items-center justify-center pb-8 laptop:h-screen laptop:w-[60vw]">
          <TrainingText
            headingId="personalized-training-title"
            number="01"
            title={texts.customTraining.title}
            subtitle={texts.customTraining.description}
            text={texts.customTraining.text}
          />
        </Container.Flex>
        <Container.Flex
          className="relative z-0 h-[60dvh] w-full bg-cover bg-[center_35%] laptop:h-screen laptop:w-[70%] laptop:bg-center"
          style={{
            backgroundImage: `url(${CustomTrainingImg})`,
          }}
        >
          <></>
        </Container.Flex>
      </Container.Flex>
    </section>
  );
}

export default CustomTraining;
