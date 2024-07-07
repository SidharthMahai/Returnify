import React from 'react';
import { Flex, Box, Heading, Text, useColorModeValue } from '@chakra-ui/react';

const Card = ({ title, description }) => {
  const bg = useColorModeValue('white', 'gray.800');
  const boxShadow = useColorModeValue('md', 'lg');
  const textColor = useColorModeValue('gray.700', 'white'); // Dynamic text color based on theme

  return (
    <Flex
      direction="column"
      maxW="300px"
      maxH="300px"
      minH="300px"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow={boxShadow}
      bg={bg}
      cursor="pointer"
      transition="transform 0.2s"
      _hover={{
        transform: 'scale(1.05)',
        boxShadow: boxShadow,
      }}
    >
      <Box p="8" flex="1" d="flex" flexDirection="column">
        <Heading as="h2" size="lg" mb={4}>
          {title}
        </Heading>
        <Text fontSize="md" color={textColor}>
          {description}
        </Text>
      </Box>
    </Flex>
  );
};

export default Card;
