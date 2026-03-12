import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Icon,
  Link as ChakraLink,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { NavLink, Link } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/live-mutual-funds-analysis', label: 'Live NAV' },
  { to: '/ppf-calculator', label: 'PPF' },
  { to: '/about', label: 'About' },
];

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const shellBg = useColorModeValue('rgba(255, 255, 255, 0.72)', 'rgba(8, 17, 31, 0.72)');
  const shellBorder = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200');
  const mutedText = useColorModeValue('ink.600', 'whiteAlpha.700');
  const navText = useColorModeValue('ink.700', 'whiteAlpha.900');
  const navHover = useColorModeValue('whiteAlpha.800', 'whiteAlpha.200');
  const buttonBg = useColorModeValue('whiteAlpha.700', 'whiteAlpha.160');
  const buttonBorder = useColorModeValue('whiteAlpha.700', 'whiteAlpha.300');
  const shadow = useColorModeValue('glass', 'glassDark');

  return (
    <Box as="header" position="sticky" top={0} zIndex={20} px={{ base: 4, md: 6 }} pt={4}>
      <Container maxW="7xl">
        <Flex
          align="center"
          justify="space-between"
          px={{ base: 4, md: 6 }}
          py={3}
          borderWidth="1px"
          borderColor={shellBorder}
          bg={shellBg}
          backdropFilter="blur(18px)"
          borderRadius="full"
          boxShadow={shadow}
          gap={4}
          wrap="wrap"
        >
          <Stack spacing={0}>
            <ChakraLink as={Link} to="/" _hover={{ textDecoration: 'none' }}>
              <Text fontFamily="heading" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="700" letterSpacing="-0.03em">
                Returnify
              </Text>
            </ChakraLink>
            <Text fontSize="sm" color={mutedText}>
              Fewer spreadsheets, fewer sighs
            </Text>
          </Stack>

          <HStack spacing={2} flexWrap="wrap" justify="flex-end">
            {navItems.map((item) => (
              <ChakraLink
                as={NavLink}
                key={item.to}
                to={item.to}
                px={4}
                py={2}
                borderRadius="full"
                fontWeight="700"
                color={navText}
                _hover={{ textDecoration: 'none', bg: navHover }}
                _activeLink={{
                  bg: 'brand.500',
                  color: 'white',
                  boxShadow: 'soft',
                }}
              >
                {item.label}
              </ChakraLink>
            ))}
            <Button
              onClick={toggleColorMode}
              variant="outline"
              bg={buttonBg}
              borderColor={buttonBorder}
              leftIcon={<Icon as={colorMode === 'light' ? MoonIcon : SunIcon} />}
            >
              {colorMode === 'light' ? 'Lights off' : 'Sun pls'}
            </Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
