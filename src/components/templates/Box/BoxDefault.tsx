import { Container } from "../../base/Container";
import { Text } from "../../base/Text";
import { TemplateText } from "../Text";
import { TemplateButton } from "../Button";

interface TemplateBoxDefaultProps {
  title: string;
  subtitle: string;
  text: string;
  dialogLink: string;
}

export function TemplateBoxDefault({
  title,
  subtitle,
  text,
  dialogLink,
}: TemplateBoxDefaultProps) {
  return (
    <Container.Flex className="mx-4 w-[680px] flex-col gap-8 laptop:mx-0">
      <Container.Flex className="laptop-px-4 animate-pulse-neon-fail flex-col gap-4 rounded-xl border-t-4 border-secondary bg-gradient-to-b from-suport-100 to-suport-300 p-4 px-3 shadow-[0_0_5px_#004094,0_0_10px_#004094,0_0_15px_#004094] laptop:p-8">
        <Container.Flex className="flex-col">
          <Text.Title className="text-3xl text-secondary laptop:text-5xl">
            {title}
          </Text.Title>
          <Text.Title className="text-2xl text-subtitle laptop:text-4xl">
            {subtitle}
          </Text.Title>
        </Container.Flex>
        <TemplateText.Block
          text={text.replaceAll("/n/n", "<br/> <br/>")}
          has_box
          className="text-md text-center laptop:text-start laptop:text-xl"
        />
        <TemplateButton.Link
          className="block py-4 text-3xl laptop:hidden laptop:w-full laptop:text-4xl"
          link="https://wa.me/553284596559?text=Olá%20Lucas%2C%20gostaria%20de%20saber%20mais%20sobre%20seu%20treinamento%20personalizado!"
          has_box
        />
      </Container.Flex>
      <TemplateButton.Link
        className="mb-6 hidden py-4 text-3xl laptop:block laptop:w-full laptop:text-4xl"
        link={dialogLink}
        has_box
      />
    </Container.Flex>
  );
}
