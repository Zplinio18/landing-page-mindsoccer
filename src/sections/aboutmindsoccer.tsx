import { Container } from "../components/base/Container";
import mindSoccerImg from "../assets/images/mindsoccer.png";
import logoImg from "../assets/images/logo.png";

function AboutMindsoccer() {
  return (
    <Container.Flex className="h-auto flex-col-reverse justify-between gap-4 bg-gradient-to-b from-primary to-black laptop:h-screen laptop:flex-row">
      <Container.Flex
        className="h-[80dvh] w-full bg-cover bg-center laptop:h-screen laptop:w-[70%]"
        style={{
          backgroundImage: `url(${mindSoccerImg})`,
        }}
      >
        <></>
      </Container.Flex>
      <Container.Flex className="flex-col justify-center py-16 pb-8 laptop:h-screen laptop:w-[80vw]">
        <Container.Flex
          className="h-[100px] w-[300px] bg-cover bg-center"
          style={{
            backgroundImage: `url(${logoImg})`,
          }}
        >
          <></>
        </Container.Flex>
      </Container.Flex>
    </Container.Flex>
  );
}

export default AboutMindsoccer;
