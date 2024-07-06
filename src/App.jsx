// App.js
import React from 'react';
import {
  Box,
  Center,
  Heading,
  Text,
  Image,
  Flex,
} from '@chakra-ui/react';

const App = () => {
  return (
    <Center h="100vh" bg="gray.100">
      <Box
        maxW="lg"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        bg="white"
      >
        <Image
          src="https://source.unsplash.com/featured/?investment,finance"
          alt="Live Returns"
          objectFit="cover"
          h="200px"
          w="100%"
        />
        <Box p="6">
          <Heading as="h2" size="xl" mb={4}>
            Live Mutual Funds NAV
          </Heading>
          <Text fontSize="md" color="gray.700">
            Stay updated with the latest Net Asset Value (NAV) of your mutual funds in real-time. Monitor the performance of your investments and make informed decisions with accurate and up-to-date data.
          </Text>
        </Box>
      </Box>
    </Center>
  );
};

export default App;