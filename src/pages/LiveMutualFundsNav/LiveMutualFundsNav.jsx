import React from 'react';
import { Center, VStack } from '@chakra-ui/react';
import Hero from '../../components/Hero/Hero';

const LiveMutualFundsNav = () => (
  <VStack spacing={10} bg="gray.100" minH="100vh">
    <Hero
      title="Live Mutual Funds NAV"
      description="Stay updated with the latest Net Asset Value (NAV) of your mutual funds in real-time. Monitor the performance of your investments and make informed decisions with accurate and up-to-date data."
    />
    <Center py={10} w="full"></Center>
  </VStack>
);

export default LiveMutualFundsNav;
