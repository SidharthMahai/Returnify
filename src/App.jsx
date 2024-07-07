import React from 'react';
import { Center, SimpleGrid } from '@chakra-ui/react';
import Card from './components/Card/Card';

const Home = () => (
  <Center py={10} bg="gray.100" minH="100vh">
    <SimpleGrid columns={[1, 1, 3]} spacing={10} maxW="90%">
      <Card
        title="Live Mutual Funds NAV"
        description="Stay updated with the latest Net Asset Value (NAV) of your mutual funds in real-time. Monitor the performance of your investments and make informed decisions with accurate and up-to-date data."
      />
      <Card
        title="HRA Exemption Calculator"
        description="Calculate your House Rent Allowance (HRA) exemption easily. Understand how much of your HRA is exempt from tax and optimize your salary structure."
      />
      <Card
        title="PPF Returns Calculator"
        description="Estimate the returns on your Public Provident Fund (PPF) investments. Plan your savings and understand the growth of your PPF account over time."
      />
    </SimpleGrid>
  </Center>
);

export default Home;
