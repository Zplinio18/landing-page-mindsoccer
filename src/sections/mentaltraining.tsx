import { Container } from "../components/base/Container";
import mentalTrainingImg from "../assets/images/mentaltraining.png";
import { TemplateBox } from "../components/templates/Box";
import texts from "../utils/texts";

function MentalTraining() {
  return (
    <Container.Flex className="relative h-auto flex-col-reverse justify-between gap-4 bg-black laptop:h-screen laptop:flex-row">
      <Container.Flex
        className="relative z-0 -mt-[105px] h-[65dvh] w-full bg-cover bg-[center_35%] laptop:h-screen laptop:w-[70%] laptop:bg-center"
        style={{
          backgroundImage: `
      linear-gradient(
        to bottom,
        rgba(0, 0, 0, 1),
        rgba(0, 0, 0, 0)
      ),
      url(${mentalTrainingImg})
    `,
        }}
      >
        <></>
      </Container.Flex>
      <Container.Flex className="relative z-10 items-center justify-center pb-8 laptop:h-screen laptop:w-[60vw]">
        <TemplateBox.Default
          title={texts.mentalTraining.title}
          subtitle={texts.mentalTraining.description}
          text={texts.mentalTraining.text}
        />
      </Container.Flex>
    </Container.Flex>
  );
}

export default MentalTraining;
