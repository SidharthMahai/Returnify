import React from 'react';
import { Center, VStack } from '@chakra-ui/react';
import Hero from '../../components/Hero/Hero';

const HRA = () => (
  <VStack spacing={10} minH="100vh">
    <Hero
      title="HRA Exemption Calculator"
      description="Stay updated with the latest Net Asset Value (NAV) of your mutual funds in real-time. Monitor the performance of your investments and make informed decisions with accurate and up-to-date data."
    />
    <Center py={10} w="full"></Center>
  </VStack>
);

export default HRA;
