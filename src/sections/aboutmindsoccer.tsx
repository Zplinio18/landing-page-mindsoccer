import { Container } from "../components/base/Container";
import mindSoccerImg from "../assets/images/mindsoccer.png";
import logoImg from "../assets/images/logo.png";
import { Text } from "../components/base/Text";
import { TemplateText } from "../components/templates/Text";
import texts from "../utils/texts";
import { TemplateButton } from "../components/templates/Button";

function AboutMindsoccer() {
  return (
    <Container.Flex className="h-auto flex-col-reverse justify-between gap-4 bg-gradient-to-b from-primary to-black px-2 pt-8 laptop:h-screen laptop:flex-row laptop:pt-0">
      <Container.Flex
        className="h-[80dvh] w-full bg-cover bg-center laptop:h-screen laptop:w-[70%]"
        style={{
          backgroundImage: `url(${mindSoccerImg})`,
        }}
      >
        <></>
      </Container.Flex>
      <Container.Flex className="flex-col justify-center gap-10 px-4 pt-4 laptop:h-screen laptop:w-[80vw]">
        <Container.Flex
          className="animate-slide-left-fade h-[70px] w-[200px] bg-cover bg-center laptop:h-[100px] laptop:w-[300px]"
          style={{
            backgroundImage: `url(${logoImg})`,
          }}
        >
          <></>
        </Container.Flex>
        <Text.Title className="animate-slide-left-fade text-4xl text-white laptop:text-6xl">
          Sejam todos bem-vindos a minha metodologia{" "}
          <span className="text-secondary">MINDSOCCER</span>
        </Text.Title>
        <TemplateText.Block
          text={texts.mindsoccer.text.replaceAll("/n/n", "<br/> <br/>")}
          className="animate-slide-right-fade"
        />
        <TemplateButton.Link
          link="https://wa.me/5532984596559?text=Olá%20Lucas%2C%20gostaria%20de%20saber%20mais%20sobre%20a%20metodologia%20Minsoccer!%20⚽"
          className="animate-slide-left-fade mb-6 py-4 text-3xl laptop:w-[400px] laptop:text-4xl"
        ></TemplateButton.Link>
      </Container.Flex>
    </Container.Flex>
  );
}

export default AboutMindsoccer;
