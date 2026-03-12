import { Box, Heading, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const Card = ({ title, description, tag = 'Calculator' }) => {
  const bg = useColorModeValue('rgba(255, 255, 255, 0.74)', 'rgba(15, 27, 45, 0.78)');
  const borderColor = useColorModeValue('whiteAlpha.700', 'whiteAlpha.200');
  const shadow = useColorModeValue('glass', 'glassDark');
  const hoverShadow = useColorModeValue('soft', 'glassDark');
  const badgeBg = useColorModeValue('surface.100', 'whiteAlpha.140');
  const titleColor = useColorModeValue('ink.900', 'whiteAlpha.900');
  const textColor = useColorModeValue('ink.600', 'whiteAlpha.700');

  return (
    <Box
      position="relative"
      overflow="hidden"
      h="100%"
      minH={{ base: 'auto', md: '18rem' }}
      borderRadius="3xl"
      p={{ base: 6, md: 7 }}
      borderWidth="1px"
      borderColor={borderColor}
      bg={bg}
      backdropFilter="blur(18px)"
      boxShadow={shadow}
      transition="transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease"
      _before={{
        content: '""',
        position: 'absolute',
        inset: 'auto -10% -25% auto',
        w: '9rem',
        h: '9rem',
        bg: 'linear-gradient(135deg, rgba(24,145,255,0.25), rgba(45,212,191,0.16))',
        borderRadius: 'full',
        filter: 'blur(8px)',
      }}
      _hover={{
        transform: 'translateY(-6px)',
        boxShadow: hoverShadow,
        borderColor: 'brand.200',
      }}
    >
      <HStack
        position="relative"
        zIndex={1}
        display="inline-flex"
        px={3}
        py={1}
        mb={5}
        borderRadius="full"
        bg={badgeBg}
        color="brand.700"
        fontSize="sm"
        fontWeight="800"
        letterSpacing="0.04em"
      >
        <Text>{tag}</Text>
      </HStack>
      <Heading
        position="relative"
        zIndex={1}
        as="h2"
        size="lg"
        mb={4}
        color={titleColor}
        letterSpacing="-0.03em"
      >
        {title}
      </Heading>
      <Text position="relative" zIndex={1} color={textColor} fontSize="md" lineHeight="tall">
        {description}
      </Text>
    </Box>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  tag: PropTypes.string,
};

export default Card;
