import { Container } from "../components/base/Container";
import CustomTrainingImg from "../assets/images/customtraining.png";
import { TemplateBox } from "../components/templates/Box";
import texts from "../utils/texts";

function CustomTraining() {
  return (
    <Container.Flex className="h-auto flex-col justify-between gap-4 bg-black laptop:h-screen laptop:flex-row">
      <Container.Flex className="items-center justify-center pb-8 laptop:h-screen laptop:w-[60vw]">
        <TemplateBox.Default
          title={texts.customTraining.title}
          subtitle={texts.customTraining.description}
          text={texts.customTraining.text}
          dialogLink="https://wa.me/553284596559?text=Olá%20Lucas%2C%20gostaria%20de%20saber%20mais%20sobre%20seu%20treinamento%20personalizado!"
        />
      </Container.Flex>
      <Container.Flex
        className="h-[60dvh] w-full bg-cover bg-center laptop:h-screen laptop:w-[70%]"
        style={{
          backgroundImage: `url(${CustomTrainingImg})`,
        }}
      >
        <></>
      </Container.Flex>
    </Container.Flex>
  );
}

export default CustomTraining;
