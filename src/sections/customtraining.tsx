import { Container } from "../components/base/Container";
import CustomTrainingImg from "../assets/images/customtraining.png";
import { TemplateBox } from "../components/templates/Box";
import texts from "../utils/texts";

function CustomTraining() {
  return (
    <Container.Flex className="w-full flex-col bg-black px-4 laptop:px-20">
      <Container.Flex className="relative h-auto flex-col justify-between py-8 laptop:h-screen laptop:flex-row laptop:gap-4 laptop:py-0">
        <Container.Flex className="relative z-10 items-center justify-center pb-8 laptop:h-screen laptop:w-[60vw]">
          <TemplateBox.Default
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
    </Container.Flex>
  );
}

export default CustomTraining;
