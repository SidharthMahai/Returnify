import {
  Badge,
  Box,
  Container,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

const Hero = ({ title, description, eyebrow = 'Finance calculators' }) => {
  const heroBg = useColorModeValue(
    'linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(14,90,174,0.92) 55%, rgba(45,212,191,0.85) 100%)',
    'linear-gradient(135deg, rgba(2,6,23,0.98) 0%, rgba(10,63,125,0.94) 55%, rgba(13,148,136,0.82) 100%)'
  );
  const glowBg = useColorModeValue('whiteAlpha.300', 'brand.300');

  return (
    <Container maxW="7xl" pt={{ base: 8, md: 12 }}>
      <Box
        position="relative"
        overflow="hidden"
        borderRadius="3xl"
        px={{ base: 6, md: 10 }}
        py={{ base: 8, md: 12 }}
        bg={heroBg}
        color="white"
        boxShadow={useColorModeValue('soft', 'glassDark')}
      >
        <Box
          position="absolute"
          inset="auto -12% -45% auto"
          w={{ base: '12rem', md: '18rem' }}
          h={{ base: '12rem', md: '18rem' }}
          borderRadius="full"
          bg={glowBg}
          opacity={0.25}
          filter="blur(18px)"
        />
        <Stack spacing={5} position="relative" maxW="3xl">
          <Badge
            alignSelf="flex-start"
            px={3}
            py={1}
            borderRadius="full"
            bg="whiteAlpha.240"
            color="white"
            textTransform="uppercase"
            letterSpacing="0.14em"
          >
            {eyebrow}
          </Badge>
          <Heading
            as="h1"
            fontSize={{ base: '3xl', md: '5xl' }}
            lineHeight={{ base: 1.1, md: 1 }}
            letterSpacing="-0.05em"
          >
            {title}
          </Heading>
          <Text fontSize={{ base: 'md', md: 'xl' }} color="whiteAlpha.900" maxW="2xl">
            {description}
          </Text>
        </Stack>
      </Box>
    </Container>
  );
};

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  eyebrow: PropTypes.string,
};

export default Hero;
