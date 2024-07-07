import React from 'react';
import { Flex, Box, Heading, Text } from '@chakra-ui/react';
const Card = ({ title, description }) => (
  <Flex
    direction="column"
    maxW="320px"
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    boxShadow="md"
    bg="white"
    height="350px"
  >
    <Box p="8" flex="1" d="flex" flexDirection="column">
      <Heading as="h2" size="lg" mb={4}>
        {title}
      </Heading>
      <Text fontSize="md" color="gray.700">
        {description}
      </Text>
    </Box>
  </Flex>
);

export default Card;
