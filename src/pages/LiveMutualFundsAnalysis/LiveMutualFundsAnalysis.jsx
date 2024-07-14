import { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Divider,
  Heading,
  VStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Input,
  Button,
  HStack,
} from '@chakra-ui/react';
import Hero from '../../components/Hero/Hero';

const LiveMutualFundsNav = () => {
  const [stockSymbol, setStockSymbol] = useState('');
  const [livePrice, setLivePrice] = useState(null);
  const [yesterdayClose, setYesterdayClose] = useState(null);
  const [gainLossPercentage, setGainLossPercentage] = useState(null);

  const handleStockSymbolChange = (event) => {
    setStockSymbol(event.target.value);
    setLivePrice(null);
    setYesterdayClose(null);
    setGainLossPercentage(null);
  };

  const fetchStockData = async () => {
    try {
      const response = await axios.get(
        `https://api.allorigins.win/get?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v7/finance/chart/${stockSymbol}.BO?range=1d&interval=5m&indicators=quote&includeTimestamps=true`)}`
      );

      const chartData = JSON.parse(response.data.contents).chart.result[0];
      const closes = chartData.indicators.quote[0].close;

      // Live price is the last available close
      const livePriceValue = closes[closes.length - 1];
      setLivePrice(livePriceValue);

      // Yesterday's close from the meta object
      const meta = chartData.meta;
      const yesterdayCloseValue = meta.previousClose;
      setYesterdayClose(yesterdayCloseValue);

      // Calculate gain/loss percentage
      const gainLoss = livePriceValue - yesterdayCloseValue;
      const gainLossPercent = (gainLoss / yesterdayCloseValue) * 100;
      setGainLossPercentage(gainLossPercent);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const handleButtonClick = () => {
    fetchStockData();
  };

  const handleClearValues = () => {
    setLivePrice(null);
    setYesterdayClose(null);
    setGainLossPercentage(null);
    setStockSymbol('');
  };

  return (
    <VStack spacing={10} minH="100vh" p={5}>
      <Hero
        title="Live Mutual Funds Analysis"
        description="Monitor the real-time performance of the stocks in Mutual Funds, predicted live NAV of your mutual fund & make informed decisions."
      />
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" width="50%">
        <Heading as="h3" size="lg" mb={5} textAlign="center">
          Enter Stock Symbol
        </Heading>
        <Input
          placeholder="Enter Stock Symbol (e.g., HAL)"
          value={stockSymbol.toUpperCase()}
          onChange={handleStockSymbolChange}
          mb={3}
        />
        <HStack spacing={3} mb={3}>
          <Button colorScheme="blue" onClick={handleButtonClick}>
            Get KPIs
          </Button>
          {livePrice !== null &&
            yesterdayClose !== null &&
            gainLossPercentage !== null && (
              <Button colorScheme="red" onClick={handleClearValues}>
                Clear Values
              </Button>
            )}
        </HStack>
        <Divider mb={5} />
        {livePrice !== null &&
          yesterdayClose !== null &&
          gainLossPercentage !== null && (
            <>
              <Heading as="h4" size="md" mb={3} textAlign="center">
                {stockSymbol.toUpperCase()}
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                <Stat p={5} shadow="md" borderWidth="1px" borderRadius="lg">
                  <StatLabel>Live Price</StatLabel>
                  <StatNumber>{livePrice.toFixed(2)}</StatNumber>
                </Stat>
                <Stat p={5} shadow="md" borderWidth="1px" borderRadius="lg">
                  <StatLabel>{"Yesterday's Close"}</StatLabel>
                  <StatNumber>{yesterdayClose.toFixed(2)}</StatNumber>
                </Stat>
                <Stat
                  p={5}
                  color={gainLossPercentage >= 0 ? 'green' : 'red'}
                  shadow="md"
                  borderWidth="1px"
                  borderRadius="lg"
                >
                  <StatLabel>Gain/Loss Percentage</StatLabel>
                  <StatNumber>{`${gainLossPercentage.toFixed(2)}%`}</StatNumber>
                  <StatHelpText>
                    {gainLossPercentage >= 0 ? 'Gain' : 'Loss'}
                  </StatHelpText>
                </Stat>
              </SimpleGrid>
            </>
          )}
      </Box>
    </VStack>
  );
};

export default LiveMutualFundsNav;