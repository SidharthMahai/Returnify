import {
  Box,
  Flex,
  Heading,
  Spacer,
  Button,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Header = () => {
  const { toggleColorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const color = useColorModeValue('gray.800', 'white');

  return (
    <Box bg={bg} px={4} boxShadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Heading as="h1" size="lg" color={color}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Returnify
          </Link>
        </Heading>
        <Spacer />
        <Flex alignItems="center">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button variant="ghost" color={color} mr={4}>
              Home
            </Button>
          </Link>
          <Link
            to="/live-mutual-funds-nav"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Button variant="ghost" color={color} mr={4}>
              Live NAV
            </Button>
          </Link>
          <Link
            to="/hra-exemption"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Button variant="ghost" color={color} mr={4}>
              HRA Calculator
            </Button>
          </Link>
          <Link
            to="/ppf-calculator"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Button variant="ghost" color={color} mr={4}>
              PPF Calculator
            </Button>
          </Link>
          <Button onClick={toggleColorMode} variant="ghost" color={color}>
            Toggle {useColorModeValue('Dark', 'Light')}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
