import { Center, SimpleGrid, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Hero from '../../components/Hero/Hero';

const Home = () => (
  <VStack spacing={10} minH="100vh">
    <Hero
      title="Returnify"
      description="Welcome to Returnify! Your one-stop solution for unique financial calculators that you won't find anywhere else on the internet. Get real-time updates on mutual fund NAVs, calculate HRA exemptions considering multiple salary and rent changes, and much more."
    />
    <Center py={10} w="full">
      <SimpleGrid columns={[1, 1, 3]} spacing={10} maxW="90%">
        <Link to="/live-mutual-funds-analysis">
          <Card
            title="Live Mutual Funds Analysis"
            description="Monitor the real-time performance of the stocks in Mutual Funds, predicted live NAV of your mutual fund & make informed decisions."
          />
        </Link>
        <Link to="/hra-exemption">
          <Card
            title="HRA Exemption Calculator"
            description="Calculate your House Rent Allowance (HRA) exemption easily. Understand how much of your HRA is exempt from tax and optimize your salary structure."
          />
        </Link>
        <Link to="/ppf-calculator">
          <Card
            title="PPF Returns Calculator"
            description="Estimate the returns on your Public Provident Fund (PPF) investments. Plan your savings and understand the growth of your PPF account over time."
          />
        </Link>
      </SimpleGrid>
    </Center>
  </VStack>
);

export default Home;
