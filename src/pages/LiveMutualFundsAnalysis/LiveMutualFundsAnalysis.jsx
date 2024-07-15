import { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Divider,
  Heading,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Input,
  Button,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  Text,
} from '@chakra-ui/react';
import Hero from '../../components/Hero/Hero';
import { format } from 'date-fns';

const LiveMutualFundsNav = () => {
  const [stockSymbol, setStockSymbol] = useState('');
  const [livePrice, setLivePrice] = useState(null);
  const [yesterdayClose, setYesterdayClose] = useState(null);
  const [gainLossPercentage, setGainLossPercentage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const handleStockSymbolChange = (event) => {
    setStockSymbol(event.target.value);
    setLivePrice(null);
    setYesterdayClose(null);
    setGainLossPercentage(null);
    setError(null);
    setLastUpdated(null);
  };

  const fetchStockData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          `https://query1.finance.yahoo.com/v7/finance/chart/${stockSymbol}.BO?range=1d&interval=1m&indicators=quote&includeTimestamps=true`
        )}`
      );

      const chartData = JSON.parse(response.data.contents).chart.result[0];
      const closes = chartData.indicators.quote[0].close;
      const timestamps = chartData.timestamp;
      const meta = chartData.meta;

      // Live price is the last available close
      const livePriceValue = closes[closes.length - 1];
      setLivePrice(livePriceValue);

      // Yesterday's close from the meta object
      const yesterdayCloseValue = meta.previousClose;
      setYesterdayClose(yesterdayCloseValue);

      // Calculate gain/loss percentage
      const gainLoss = livePriceValue - yesterdayCloseValue;
      const gainLossPercent = (gainLoss / yesterdayCloseValue) * 100;
      setGainLossPercentage(gainLossPercent);

      const lastTimestamp = new Date(timestamps[timestamps.length - 1] * 1000);
      const istTime = new Date(lastTimestamp.getTime());
      setLastUpdated(format(istTime, "EEEE, MMMM do yyyy, h:mm a"));
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Could not find a stock based on the input.');
    } finally {
      setLoading(false);
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
    setError(null);
    setLastUpdated(null);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchStockData();
    }
  };

  return (
    <VStack spacing={10} minH="100vh" p={5}>
      <Hero
        title="Live Mutual Funds Analysis"
        description="Monitor the real-time performance of the stocks in Mutual Funds, predicted live NAV of your mutual fund & make informed decisions."
      />
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" width="70%">
        <Heading as="h3" size="lg" mb={5} textAlign="center">
          Enter Stock Symbol
        </Heading>
        <Input
          placeholder="Enter Stock Symbol (e.g., HAL)"
          value={stockSymbol.toUpperCase()}
          onChange={handleStockSymbolChange}
          onKeyPress={handleKeyPress}
          mb={3}
        />
        <HStack spacing={3} mb={3}>
          <Button colorScheme="blue" onClick={handleButtonClick}>
            Get KPIs
          </Button>
          {livePrice !== null &&
            yesterdayClose !== null &&
            gainLossPercentage !== null && (
              <>
                <Button colorScheme="teal" onClick={fetchStockData}>
                  Fetch Latest Value
                </Button>
                <Button colorScheme="red" onClick={handleClearValues}>
                  Clear Values
                </Button>
              </>
            )}
        </HStack>
        <Divider mb={5} />
        {loading && (
          <Box textAlign="center" my={5}>
            <Spinner size="xl" />
          </Box>
        )}
        {error && (
          <Alert status="error" mt={5}>
            <AlertIcon />
            Unable to find any values for Stock: {stockSymbol}
          </Alert>
        )}
        {!loading &&
          livePrice !== null &&
          yesterdayClose !== null &&
          gainLossPercentage !== null && (
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" display="flex" alignItems="center">
              <Box mr={5}>
                <Text fontSize="2xl" fontWeight="bold">
                  {stockSymbol.toUpperCase()}
                </Text>
              </Box>
              <Divider orientation="vertical" height="50px" mr={5} />
              <HStack spacing={10} flex="1" justifyContent="space-between">
                <Stat>
                  <StatLabel>Live Price</StatLabel>
                  <StatNumber>{livePrice.toFixed(2)}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>{"Yesterday's Close"}</StatLabel>
                  <StatNumber>{yesterdayClose.toFixed(2)}</StatNumber>
                </Stat>
                <Stat color={gainLossPercentage >= 0 ? 'green.500' : 'red.500'}>
                  <StatLabel>Gain/Loss Percentage</StatLabel>
                  <StatNumber>{`${gainLossPercentage.toFixed(2)}%`}</StatNumber>
                  <StatHelpText>
                    {gainLossPercentage >= 0 ? 'Gain' : 'Loss'}
                  </StatHelpText>
                </Stat>
              </HStack>
            </Box>
          )}
        {!loading && lastUpdated && (
          <Alert status="info" mt={5} bg="gray.200">
            <AlertIcon />
            Data last updated at: {lastUpdated} (IST)
          </Alert>
        )}
      </Box>
    </VStack>
  );
};

export default LiveMutualFundsNav;