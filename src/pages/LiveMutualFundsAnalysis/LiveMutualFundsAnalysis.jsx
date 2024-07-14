import { Box, Divider, Heading, VStack } from '@chakra-ui/react';
import Hero from '../../components/Hero/Hero';

const LiveMutualFundsNav = () => (
  <VStack spacing={10} minH="100vh" p={5}>
    <Hero
      title="Live Mutual Funds Analysis"
      description="Monitor the real-time performance of the stocks in Mutual Funds, predicted live NAV of your mutual fund & make informed decisions."
    />
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" width="50%">
      <Heading as="h3" size="lg" mb={5} textAlign="center">
        Select your Mutual Fund
      </Heading>
      <Divider mb={5} />
    </Box>
  </VStack>
);

export default LiveMutualFundsNav;
