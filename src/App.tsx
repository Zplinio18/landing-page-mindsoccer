import { Container } from "./components/base/Container";
import AboutMindsoccer from "./sections/aboutmindsoccer";
import CustomTraining from "./sections/customtraining";
import MentalTraining from "./sections/mentaltraining";

function App() {
  return (
    <Container.Flex className="w-full flex-col">
      <AboutMindsoccer />
      <CustomTraining />
      <MentalTraining />
    </Container.Flex>
  );
}

export default App;
