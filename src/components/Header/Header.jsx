import React from 'react';
import { Box, Flex, Heading, Spacer, Button, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

const Header = () => {
  const history = useHistory();
  const { toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const color = useColorModeValue('gray.800', 'white');

  const navigateTo = (route) => {
    history.push(route);
  };

  return (
    <Box bg={bg} px={4} boxShadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Heading as="h1" size="lg" color={color} cursor="pointer" onClick={() => navigateTo('/')}>
          Returnify
        </Heading>
        <Spacer />
        <Flex alignItems="center">
          <Button variant="ghost" color={color} mr={4} onClick={() => navigateTo('/')}>
            Home
          </Button>
          <Button variant="ghost" color={color} mr={4} onClick={() => navigateTo('/live-mutual-funds-nav')}>
            Live NAV
          </Button>
          <Button variant="ghost" color={color} mr={4} onClick={() => navigateTo('/hra-exemption')}>
            HRA Calculator
          </Button>
          <Button variant="ghost" color={color} mr={4} onClick={() => navigateTo('/ppf-calculator')}>
            PPF Calculator
          </Button>
          <Button onClick={toggleColorMode} variant="ghost" color={color} mr={4}>
            Toggle {useColorModeValue('Dark', 'Light')}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
