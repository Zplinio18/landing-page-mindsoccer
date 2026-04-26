import { Container } from "../../base/Container";
import { Text } from "../../base/Text";
import { TemplateText } from "../Text";

interface TemplateBoxDefaultProps {
  title: string;
  subtitle: string;
  text: string;
}

export function TemplateBoxDefault({
  title,
  subtitle,
  text,
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
      </Container.Flex>
    </Container.Flex>
  );
}
