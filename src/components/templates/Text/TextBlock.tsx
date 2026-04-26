import { cn } from "../../../lib/utils";
import { Container } from "../../base/Container";

interface TemplateTextBlockProps {
  className?: string;
  text: string;
  has_box?: boolean;
  mobile_scroll?: boolean;
}

export default function TemplateTextBlock({
  text,
  className,
  has_box = false,
  mobile_scroll = false,
  ...rest
}: TemplateTextBlockProps) {
  return (
    <Container.Box className="relative">
      <Container.Flex
        className={`${
          !has_box
            ? mobile_scroll
              ? "thin-scroll max-h-[30vh] overflow-auto"
              : "laptop:thin-scroll laptop:max-h-[30vh] overflow-visible laptop:overflow-auto"
            : "overflow-visible"
        } flex-col`}
        {...rest}
      >
        <div
          dangerouslySetInnerHTML={{ __html: text }}
          className={cn(
            "pb-10 pr-4 text-start font-exo2 text-lg text-white laptop:text-2xl",
            className,
          )}
        />
      </Container.Flex>
      <div
        className={`pointer-events-none absolute -bottom-1 left-0 z-10 h-36 w-full ${
          !has_box
            ? mobile_scroll
              ? "bg-gradient-to-t from-black to-transparent laptop:from-black"
              : "hidden bg-gradient-to-t from-black to-transparent laptop:block laptop:from-black"
            : ""
        } `}
      />
    </Container.Box>
  );
}
