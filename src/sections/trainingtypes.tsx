import { Container } from "../components/base/Container";
import { Text } from "../components/base/Text";

function TrainingTypes() {
  return (
    <Container.Flex className="w-full flex-col gap-12 bg-black px-4 laptop:px-20">
      {/* Top Separator */}
      <div className="mb-8 h-px w-full bg-white/10"></div>

      <Container.Flex className="animate-slide-left-fade flex-col items-center gap-4 text-center">
        <Text.Title className="text-4xl uppercase text-secondary laptop:text-6xl">
          MEUS <span className="text-white">TREINAMENTOS</span>
        </Text.Title>
        <div className="h-1 w-24 bg-secondary"></div>
      </Container.Flex>
    </Container.Flex>
  );
}

export default TrainingTypes;
