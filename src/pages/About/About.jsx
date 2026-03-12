import {
  AtSignIcon,
  ExternalLinkIcon,
  InfoIcon,
  StarIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Container,
  Grid,
  Heading,
  HStack,
  Icon,
  Link as ChakraLink,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Hero from '../../components/Hero/Hero';

const links = [
  {
    label: 'portfolio',
    href: 'https://sidharthmahaiportfolio.vercel.app',
    icon: ExternalLinkIcon,
  },
  {
    label: 'github',
    href: 'https://github.com/SidharthMahai',
    icon: ViewIcon,
  },
  {
    label: 'linkedin',
    href: 'https://www.linkedin.com/in/sidharth-mahai-52a805173/',
    icon: AtSignIcon,
  },
  {
    label: 'repo',
    href: 'https://github.com/SidharthMahai/Returnify',
    icon: StarIcon,
  },
];

const codeLine = (label, value) => `${label}: ${value}`;

const About = () => {
  const shellBg = useColorModeValue('#f8fbff', '#08111f');
  const shellBorder = useColorModeValue('#d9e5ff', 'rgba(255,255,255,0.14)');
  const codeBg = useColorModeValue('#f3f7ff', '#0b1220');
  const textColor = useColorModeValue('ink.900', 'whiteAlpha.900');
  const mutedText = useColorModeValue('ink.600', 'whiteAlpha.700');
  const lineColor = useColorModeValue('#d9e5ff', 'rgba(255,255,255,0.1)');
  const accent = useColorModeValue('brand.600', 'brand.300');
  const glow = useColorModeValue('glass', 'glassDark');
  const tileSurface = useColorModeValue('white', 'whiteAlpha.060');
  const headerSurface = useColorModeValue('white', '#0f172a');

  return (
    <Stack spacing={{ base: 8, md: 10 }} pb={16}>
      <Hero
        eyebrow="about.tsx"
        title="A small project page, but make it feel like it belongs in a code editor."
        description="Returnify is a side project I built for myself and friends. Useful, a bit nerdy, and not trying to sound like a company with a growth team."
      />

      <Container maxW="7xl">
        <Box
          borderWidth="1px"
          borderColor={shellBorder}
          borderRadius="3xl"
          overflow="hidden"
          boxShadow={glow}
          bg={shellBg}
        >
          <Box
            px={{ base: 4, md: 6 }}
            py={4}
            borderBottomWidth="1px"
            borderColor={shellBorder}
            bg={headerSurface}
          >
            <Stack spacing={1}>
              <HStack spacing={2}>
                <Icon as={InfoIcon} color="brand.500" />
                <Text fontSize="sm" fontFamily="mono" color={mutedText}>
                  /src/pages/about.tsx
                </Text>
              </HStack>
              <Heading size="md" color={textColor}>
                Project Notes
              </Heading>
            </Stack>
          </Box>

          <Grid templateColumns={{ base: '1fr', lg: '1.1fr 0.9fr' }}>
            <Box
              p={{ base: 5, md: 7 }}
              borderRightWidth={{ base: '0', lg: '1px' }}
              borderColor={shellBorder}
              bg={codeBg}
            >
              <Stack spacing={4} fontFamily="mono" fontSize={{ base: 'sm', md: 'md' }}>
                <Text color={accent}>const project = &#123;</Text>
                <Text color={textColor} pl={6}>
                  {codeLine('name', "'Returnify'")}
                </Text>
                <Text color={textColor} pl={6}>
                  {codeLine('type', "'side-project'")}
                </Text>
                <Text color={textColor} pl={6}>
                  {codeLine('builtBy', "'Sidharth Mahai'")}
                </Text>
                <Text color={textColor} pl={6}>
                  {codeLine('for', "'me + friends who want a quick calculator link'")}
                </Text>
                <Text color={textColor} pl={6}>
                  {codeLine('liveDataSource', "'free Groww APIs'")}
                </Text>
                <Text color={textColor} pl={6}>
                  {codeLine('vibe', "'useful > corporate'")}
                </Text>
                <Text color={accent}>&#125;;</Text>
              </Stack>
            </Box>

            <Box p={{ base: 5, md: 7 }}>
              <Stack spacing={6}>
                <Box>
                  <HStack spacing={3} mb={3}>
                    <Icon as={ViewIcon} boxSize={4} color="brand.500" />
                    <Text
                      fontSize="sm"
                      textTransform="uppercase"
                      letterSpacing="0.14em"
                      color="brand.700"
                      fontWeight="800"
                    >
                      Stack
                    </Text>
                  </HStack>
                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                    {['React', 'Vite', 'Chakra UI', 'React Router', 'Axios', 'Vercel'].map(
                      (item) => (
                        <Box
                          key={item}
                          px={4}
                          py={3}
                          borderWidth="1px"
                          borderColor={lineColor}
                          borderRadius="xl"
                          fontFamily="mono"
                          color={textColor}
                          bg={tileSurface}
                        >
                          {item}
                        </Box>
                      )
                    )}
                  </SimpleGrid>
                </Box>

                <Box>
                  <HStack spacing={3} mb={3}>
                    <Icon as={ExternalLinkIcon} boxSize={4} color="brand.500" />
                    <Text
                      fontSize="sm"
                      textTransform="uppercase"
                      letterSpacing="0.14em"
                      color="brand.700"
                      fontWeight="800"
                    >
                      Links
                    </Text>
                  </HStack>
                  <Stack spacing={3}>
                    {links.map((item) => (
                      <Box
                        key={item.label}
                        px={4}
                        py={3}
                        borderWidth="1px"
                        borderColor={lineColor}
                        borderRadius="xl"
                        bg={tileSurface}
                      >
                        <HStack spacing={2} mb={1}>
                          <Icon as={item.icon} color="brand.500" />
                          <Text fontSize="sm" color={mutedText} fontFamily="mono">
                            {item.label}
                          </Text>
                        </HStack>
                        <ChakraLink
                          href={item.href}
                          isExternal
                          color={accent}
                          fontWeight="700"
                          wordBreak="break-word"
                        >
                          {item.href}
                        </ChakraLink>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Box>
      </Container>
    </Stack>
  );
};

export default About;
