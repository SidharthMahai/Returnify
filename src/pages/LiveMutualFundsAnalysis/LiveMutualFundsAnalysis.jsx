import { useState, useEffect } from 'react';
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
  Spinner,
  Alert,
  AlertIcon,
  Select,
  HStack,
} from '@chakra-ui/react';
import { mutualFunds } from '../../constants/mutualfunds';
import Hero from '../../components/Hero/Hero';

const LiveMutualFund = () => {
  const [selectedFund, setSelectedFund] = useState('');
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFundChange = (event) => {
    setSelectedFund(event.target.value);
    setHoldings([]);
    setError(null);
  };

  const fetchHoldings = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch mutual fund holdings
      const holdingsResponse = await axios.get(
        `https://api.allorigins.win/raw?url=https://groww.in/v1/api/data/mf/web/v3/scheme/search/${selectedFund}`
      );
      const companyHoldingDetails = holdingsResponse.data.holdings;

      const holdingsData = await Promise.all(
        companyHoldingDetails.map(async (holding, index) => {
          // Introduce a delay between requests
          if (index > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          // Fetch stock symbol
          const symbolResponse = await axios.get(
            `https://api.allorigins.win/raw?url=https://groww.in/v1/api/stocks_data/v1/company/search_id/${holding.stock_search_id}`
          );
          const { nseScriptCode } = symbolResponse.data.header;

          if (index > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          // Fetch latest price
          const priceResponse = await axios.get(
            `https://api.allorigins.win/raw?url=https://groww.in/v1/api/stocks_data/v1/accord_points/exchange/NSE/segment/CASH/latest_prices_ohlc/${nseScriptCode}`
          );
          const { ltp, dayChange, dayChangePerc } = priceResponse.data;

          return {
            name: holding.company_name,
            percentage: holding.corpus_per,
            livePrice: ltp,
            previousClose: ltp - dayChange,
            dayChange,
            dayChangePerc,
          };
        })
      );

      setHoldings(holdingsData.sort((a, b) => b.percentage - a.percentage));
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFund != '') fetchHoldings();
  }, [selectedFund]);

  return (
    <VStack spacing={10} minH="100vh" p={5}>
      <Hero
        title="Live Mutual Funds Analysis"
        description="Monitor the real-time performance of the stocks in Mutual Funds, predicted live NAV of your mutual fund & make informed decisions."
      />
      <Select
        value={selectedFund}
        onChange={handleFundChange}
        placeholder="Select Mutual Fund"
        width="400px" // Adjust the width as needed
      >
        {mutualFunds.map((fund) => (
          <option key={fund.key} value={fund.key}>
            {fund.name}
          </option>
        ))}
      </Select>
      {holdings.map((holding) => (
        <Box key={holding.name} p={5} shadow="md" borderWidth="1px" width="60%">
          <Heading fontSize="xl">{holding.name}</Heading>
          <Divider my={2} />
          <HStack spacing={10} justifyContent="space-between">
            <Stat>
              <StatLabel>Live Price</StatLabel>
              <StatNumber>{holding.livePrice.toFixed(2)}</StatNumber>
            </Stat>
            <Divider orientation="vertical" height="50px" />
            <Stat>
              <StatLabel>{"Yesterday's Close"}</StatLabel>
              <StatNumber>{holding.previousClose.toFixed(2)}</StatNumber>
            </Stat>
            <Divider orientation="vertical" height="50px" />
            <Stat color={holding.dayChangePerc >= 0 ? 'green.500' : 'red.500'}>
              <StatLabel>Day Change</StatLabel>
              <StatNumber>{holding.dayChange.toFixed(2)}</StatNumber>
            </Stat>
            <Divider orientation="vertical" height="50px" />
            <Stat color={holding.dayChangePerc >= 0 ? 'green.500' : 'red.500'}>
              <StatLabel>Day Change Percentage</StatLabel>
              <StatNumber>{`${holding.dayChangePerc.toFixed(2)}%`}</StatNumber>
              <StatHelpText>
                {holding.dayChangePerc >= 0 ? 'Gain' : 'Loss'}
              </StatHelpText>
            </Stat>
            <Divider orientation="vertical" height="50px" />
            <Stat>
              <StatLabel>Percentage Holdings</StatLabel>
              <StatNumber>{`${holding.percentage.toFixed(2)}%`}</StatNumber>
            </Stat>
          </HStack>
        </Box>
      ))}
      {loading && <Spinner size="xl" />}
      {error && (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      )}
    </VStack>
  );
};

export default LiveMutualFund;
