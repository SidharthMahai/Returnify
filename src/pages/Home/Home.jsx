import { Container, SimpleGrid, Stack } from '@chakra-ui/react';
import { SearchIcon, TimeIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import Card from '../../components/Card/Card';
import Hero from '../../components/Hero/Hero';

const Home = () => {
  const isLocalhost = window.location.hostname === 'localhost';

  return (
    <Stack spacing={{ base: 10, md: 14 }} pb={16}>
      <Hero
        eyebrow="Returnify"
        title="Tiny finance helpers for people who would rather not become finance influencers."
        description="One page tells you what your mutual fund is doing right now. The other tells you what your PPF stash could grow into. Nice, simple, no TED Talk."
      />

      <Container maxW="7xl">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Link to={`/live-mutual-funds-analysis${isLocalhost ? '?cors=off' : ''}`}>
            <Card
              title="Live Mutual Fund Analysis"
              description="Peek inside a fund, see which holdings are carrying the team, and decide whether today is a buy-the-dip day or a touch-grass day."
              tag="Live"
              icon={SearchIcon}
            />
          </Link>
          <Link to="/ppf-calculator">
            <Card
              title="PPF Calculator"
              description="Slide a few numbers around and see how your long-term savings could grow without opening ten tabs."
              tag="PPF"
              icon={TimeIcon}
            />
          </Link>
        </SimpleGrid>
      </Container>
    </Stack>
  );
};

export default Home;
