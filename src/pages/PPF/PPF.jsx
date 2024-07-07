import React from 'react';
import { Center, VStack } from '@chakra-ui/react';
import Hero from '../../components/Hero/Hero';

const PPF = () => (
  <VStack spacing={10} bg="gray.100" minH="100vh">
    <Hero
      title="PPF Returns Calculator"
      description="Estimate the returns on your Public Provident Fund (PPF) investments. Plan your savings and understand the growth of your PPF account over time."
    />
    <Center py={10} w="full"></Center>
  </VStack>
);

export default PPF;
