import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';

const Hero = ({ title, description }) => (
  <Box w="full" py={10} px={6} textAlign="center">
    <VStack spacing={4}>
      <Heading as="h1" size="2xl">
        {title}
      </Heading>
      <Text maxW="70%" fontSize="lg">
        {description}
      </Text>
    </VStack>
  </Box>
);

export default Hero;
