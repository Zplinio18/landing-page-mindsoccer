import { FaSpinner, FaWhatsapp } from "react-icons/fa";
import { cn } from "../../../lib/utils";
import { Container } from "../../base/Container";
import { Text } from "../../base/Text";

interface TemplateButtonLinkProps {
  className?: string;
  loading?: boolean;
  link: string;
  has_box?: boolean;
}

export function TemplateButtonLink({
  className,
  loading = false,
  link,
  has_box = false,
  ...rest
}: TemplateButtonLinkProps) {
  return (
    <button
      className={cn(
        "rounded-xl bg-gradient-to-r from-secondary to-suport-200 text-white transition-all duration-500 hover:scale-105",
        className,
      )}
      onClick={() => window.open(link, "_blank")}
      {...rest}
    >
      {loading ? (
        <FaSpinner className="animate-spin" />
      ) : (
        <Container.Flex
          className={`flex flex-row flex-nowrap items-center justify-center gap-2 px-4 text-center ${!has_box ? "laptop:justify-around" : "gap-8"} `}
        >
          <FaWhatsapp />
          <Text.Title>Entrar em Contato</Text.Title>
        </Container.Flex>
      )}
    </button>
  );
}
