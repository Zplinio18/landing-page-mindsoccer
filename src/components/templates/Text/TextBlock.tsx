import { cn } from "../../../lib/utils";
import { Container } from "../../base/Container";

interface TemplateTextBlockProps {
  className?: string;
  text: string;
  has_box?: boolean;
}

export default function TemplateTextBlock({
  text,
  className,
  has_box = false,
  ...rest
}: TemplateTextBlockProps) {
  return (
    <Container.Box className="relative">
      <Container.Flex
        className={`thin-scroll ${!has_box ? "max-h-[30vh]" : ""} flex-col overflow-auto`}
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
        className={`pointer-events-none absolute -bottom-1 left-0 z-10 h-36 w-full ${!has_box ? "bg-gradient-to-t from-[#001030] to-transparent laptop:from-suport-400" : ""} `}
      />
    </Container.Box>
  );
}
