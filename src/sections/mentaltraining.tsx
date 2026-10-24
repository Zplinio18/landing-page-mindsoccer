import { Container } from "../components/base/Container";
import mentalTrainingImg from "../assets/images/mentaltraining.png";
import TrainingText from "../components/templates/Text/TrainingText";
import texts from "../utils/texts";

function MentalTraining() {
  return (
    <Container.Flex
      id="treinamento-mental"
      tabIndex={-1}
      className="w-full scroll-mt-28 flex-col bg-black px-4 laptop:px-20"
    >
      <Container.Flex className="relative h-auto flex-col-reverse justify-between py-8 laptop:h-screen laptop:flex-row laptop:py-0">
        <Container.Flex
          className="relative z-0 -mt-[105px] h-[65dvh] w-full bg-cover bg-[center_35%] laptop:h-screen laptop:w-[70%] laptop:bg-center"
          style={{
            backgroundImage: `
        linear-gradient(
          to bottom,
          #000 0%,
          #000 18%,
          rgba(0, 0, 0, 0.98) 25%,
          rgba(0, 0, 0, 0.85) 33%,
          rgba(0, 0, 0, 0.45) 46%,
          rgba(0, 0, 0, 0.12) 60%,
          transparent 74%
        ),
        url(${mentalTrainingImg})
      `,
          }}
        >
          <></>
        </Container.Flex>
        <Container.Flex className="relative z-10 items-center justify-center pb-8 laptop:h-screen laptop:w-[60vw]">
          <TrainingText
            number="02"
            title={texts.mentalTraining.title}
            subtitle={texts.mentalTraining.description}
            text={texts.mentalTraining.text}
          />
        </Container.Flex>
      </Container.Flex>
    </Container.Flex>
  );
}

export default MentalTraining;
