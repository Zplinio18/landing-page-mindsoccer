import { Container } from "../components/base/Container";
import mentalTrainingImg from "../assets/images/mentaltraining.png";
import { TemplateBox } from "../components/templates/Box";
import texts from "../utils/texts";

function MentalTraining() {
  return (
    <Container.Flex className="h-auto flex-col-reverse justify-between gap-4 bg-black laptop:h-screen laptop:flex-row">
      <Container.Flex
        className="h-[65dvh] w-full bg-cover bg-center laptop:h-screen laptop:w-[70%]"
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
      <Container.Flex className="items-center justify-center pb-8 laptop:h-screen laptop:w-[60vw]">
        <TemplateBox.Default
          title={texts.mentalTraining.title}
          subtitle={texts.mentalTraining.description}
          text={texts.mentalTraining.text}
          dialogLink="https://wa.me/5532984596559?text=Olá%20Lucas%2C%20gostaria%20de%20saber%20mais%20sobre%20seu%20treinamento%20mental!%20🧠⚽"
        />
      </Container.Flex>
    </Container.Flex>
  );
}

export default MentalTraining;
