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
  Progress,
  Alert,
  AlertIcon,
  Select,
  HStack,
} from '@chakra-ui/react';
import { mutualFunds } from '../../constants/mutualfunds';
import Hero from '../../components/Hero/Hero';
import _ from 'lodash';

const LiveMutualFund = () => {
  const [selectedFund, setSelectedFund] = useState('');
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [corsOff, setCorsOff] = useState(false);
  const [summary, setSummary] = useState({
    gain: 0,
    loss: 0,
    unavailable: 0,
  });
  const [overallGainLoss, setOverallGainLoss] = useState(null);
  const [recommendation, setRecommendation] = useState('N/A');
  const [allMutualFundData, setAllMutualFundData] = useState([]);
  const [cachedData, setCachedData] = useState({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const corsParam = urlParams.get('cors');
    setCorsOff(corsParam === 'off');
  }, []);

  const handleFundChange = (event) => {
    const selected = event.target.value;
    setSelectedFund(selected);
    setHoldings([]);
    setError(null);
    setProgress(0);
    setSummary({
      gain: 0,
      loss: 0,
      unavailable: 0,
    });
    setOverallGainLoss(null);
    setRecommendation('N/A');
    if (selected === 'SelectAll') {
      fetchAllMutualFunds();
    } else {
      fetchHoldings(selected);
    }
  };

  const fetchHoldings = async (fundKey) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    try {
      const holdingsResponse = await axios.get(
        corsOff
          ? `https://groww.in/v1/api/data/mf/web/v4/scheme/search/${fundKey}`
          : `https://api.allorigins.win/raw?url=https://groww.in/v1/api/data/mf/web/v4/scheme/search/${fundKey}`
      );
      const companyHoldingDetails = holdingsResponse.data.holdings;

      const totalHoldings = companyHoldingDetails.length;
      const symbols = [];
      const updatedHoldings = [];
      let gain = 0;
      let loss = 0;
      let unavailable = 0;
      let weightedGainLossSum = 0;

      for (let i = 0; i < totalHoldings; i++) {
        const holding = companyHoldingDetails[i];

        if (holding.stock_search_id) {
          if (!corsOff && i > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust delay as needed (e.g., 2 seconds)
          }

          const symbolResponse = await axios.get(
            corsOff
              ? `https://groww.in/v1/api/stocks_data/v1/company/search_id/${holding.stock_search_id}`
              : `https://api.allorigins.win/raw?url=https://groww.in/v1/api/stocks_data/v1/company/search_id/${holding.stock_search_id}`
          );
          const { bseScriptCode } = symbolResponse.data.header;

          holding.bseScriptCode = bseScriptCode;
          symbols.push(bseScriptCode);

          if (!corsOff && i > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust delay as needed (e.g., 2 seconds)
          }
        }

        const priceResponse = await axios.post(
          corsOff
            ? 'https://groww.in/v1/api/stocks_data/v1/tr_live_delayed/segment/CASH/latest_aggregated'
            : 'https://api.allorigins.win/raw?url=https://groww.in/v1/api/stocks_data/v1/tr_live_delayed/segment/CASH/latest_aggregated',
          {
            exchangeAggReqMap: {
              NSE: {
                priceSymbolList: [],
                indexSymbolList: [],
              },
              BSE: {
                priceSymbolList: [holding.bseScriptCode],
                indexSymbolList: [],
              },
            },
          }
        );

        const priceData =
          priceResponse.data.exchangeAggRespMap.BSE.priceLivePointsMap;

        const priceInfo = holding.bseScriptCode
          ? priceData[holding.bseScriptCode]
          : null;

        const updatedHolding = {
          name: holding.company_name,
          percentage: holding.corpus_per,
          livePrice: priceInfo ? priceInfo.ltp : null,
          previousClose: priceInfo ? priceInfo.close : null,
          dayChange: priceInfo ? priceInfo.dayChange : null,
          dayChangePerc: priceInfo ? priceInfo.dayChangePerc : null,
        };

        updatedHoldings.push(updatedHolding);

        if (priceInfo) {
          const holdingWeight = holding.corpus_per / 100;
          weightedGainLossSum += holdingWeight * priceInfo.dayChangePerc;

          if (priceInfo.dayChangePerc >= 0) {
            gain++;
          } else {
            loss++;
          }
        } else {
          unavailable++;
        }

        setProgress(((i + 1) / totalHoldings) * 100);
      }

      setHoldings(updatedHoldings);
      setSummary({ gain, loss, unavailable });
      setOverallGainLoss(weightedGainLossSum);

      // Determine recommendation
      const lossThreshold = -1; // Ideal percentage to suggest buying more
      setRecommendation(weightedGainLossSum < lossThreshold ? 'Yes' : 'No');

      // Update cached data
      setCachedData((prevData) => ({
        ...prevData,
        [fundKey]: {
          key: fundKey,
          weightedGainLossSum,
        },
      }));
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMutualFunds = async () => {
    setLoading(true);
    setError(null);
    setProgress(0);

    const mutualFundKeys = mutualFunds.map((fund) => fund.key);
    let allData = [];

    for (const key of mutualFundKeys) {
      if (!cachedData[key]) {
        try {
          const response = await axios.get(
            corsOff
              ? `https://groww.in/v1/api/data/mf/web/v3/scheme/search/${key}`
              : `https://api.allorigins.win/raw?url=https://groww.in/v1/api/data/mf/web/v3/scheme/search/${key}`
          );
          const companyHoldingDetails = response.data.holdings;

          const totalHoldings = companyHoldingDetails.length;
          let weightedGainLossSum = 0;

          for (let i = 0; i < totalHoldings; i++) {
            const holding = companyHoldingDetails[i];

            if (holding.stock_search_id) {
              if (!corsOff && i > 0) {
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust delay as needed (e.g., 2 seconds)
              }

              const symbolResponse = await axios.get(
                corsOff
                  ? `https://groww.in/v1/api/stocks_data/v1/company/search_id/${holding.stock_search_id}`
                  : `https://api.allorigins.win/raw?url=https://groww.in/v1/api/stocks_data/v1/company/search_id/${holding.stock_search_id}`
              );
              const { bseScriptCode } = symbolResponse.data.header;

              holding.bseScriptCode = bseScriptCode;

              if (!corsOff && i > 0) {
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust delay as needed (e.g., 2 seconds)
              }
            }

            const priceResponse = await axios.post(
              corsOff
                ? 'https://groww.in/v1/api/stocks_data/v1/tr_live_delayed/segment/CASH/latest_aggregated'
                : 'https://api.allorigins.win/raw?url=https://groww.in/v1/api/stocks_data/v1/tr_live_delayed/segment/CASH/latest_aggregated',
              {
                exchangeAggReqMap: {
                  NSE: {
                    priceSymbolList: [],
                    indexSymbolList: [],
                  },
                  BSE: {
                    priceSymbolList: [holding.bseScriptCode],
                    indexSymbolList: [],
                  },
                },
              }
            );

            const priceData =
              priceResponse.data.exchangeAggRespMap.BSE.priceLivePointsMap;

            const priceInfo = holding.bseScriptCode
              ? priceData[holding.bseScriptCode]
              : null;

            if (priceInfo) {
              const holdingWeight = holding.corpus_per / 100;
              weightedGainLossSum += holdingWeight * priceInfo.dayChangePerc;
            }

            setProgress(((allData.length + 1) / mutualFundKeys.length) * 100);
          }

          allData.push({
            key,
            weightedGainLossSum,
          });
        } catch (error) {
          setError('Failed to fetch data');
        } finally {
          setProgress((allData.length / mutualFundKeys.length) * 100);
        }
      } else {
        allData.push(cachedData[key]);
      }
    }

    setAllMutualFundData(allData);
    setLoading(false);
  };

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
        width="400px"
      >
        <option key="SelectAll" value="SelectAll">
          Select All Funds
        </option>
        {_.sortBy(mutualFunds, ['key'], ['desc']).map((fund) => (
          <option key={fund.key} value={fund.key}>
            {fund.name}
          </option>
        ))}
      </Select>

      {!loading && selectedFund === 'SelectAll' ? (
        <VStack spacing={4}>
          {allMutualFundData.map((fundData) => (
            <Box
              key={fundData.key}
              p={5}
              shadow="md"
              borderWidth="1px"
              width="100%"
              onClick={() =>
                handleFundChange({ target: { value: fundData.key } })
              }
              cursor="pointer"
            >
              <Heading fontSize="xl">
                {mutualFunds.find((mf) => mf.key === fundData.key).name}
              </Heading>
              <Divider my={2} />
              <HStack spacing={10} justifyContent="space-between">
                <Stat>
                  <StatLabel>Overall Day Change %</StatLabel>
                  <StatNumber
                    color={
                      fundData.weightedGainLossSum >= 0
                        ? 'green.500'
                        : 'red.500'
                    }
                  >
                    {fundData.weightedGainLossSum
                      ? `${fundData.weightedGainLossSum.toFixed(2)}%`
                      : 'N/A'}
                  </StatNumber>
                  <StatHelpText>
                    {fundData.weightedGainLossSum >= 0 ? 'Gain' : 'Loss'}
                  </StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Buy Today</StatLabel>
                  <StatNumber>
                    {fundData.weightedGainLossSum < -1 ? 'Yes' : 'No'}
                  </StatNumber>
                </Stat>
              </HStack>
            </Box>
          ))}
        </VStack>
      ) : !loading && selectedFund != '' ? (
        <VStack spacing={4}>
          <Box p={5} shadow="md" borderWidth="1px" width="100%">
            <Heading fontSize="xl">Live Analysis Summary</Heading>
            <Divider my={2} />
            <HStack spacing={10} justifyContent="space-between">
              <Stat>
                <StatLabel>Live Gain/Loss %</StatLabel>
                <StatNumber
                  color={overallGainLoss >= 0 ? 'green.500' : 'red.500'}
                >
                  {overallGainLoss !== null
                    ? `${overallGainLoss.toFixed(2)}%`
                    : 'N/A'}
                </StatNumber>
                <StatHelpText>
                  {overallGainLoss >= 0 ? 'Gain' : 'Loss'}
                </StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Buy Today</StatLabel>
                <StatNumber>{recommendation}</StatNumber>
              </Stat>
            </HStack>
            <HStack spacing={10} justifyContent="space-between">
              <Stat>
                <StatLabel>Number of Stocks in Gain</StatLabel>
                <StatNumber>{summary.gain}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Number of Stocks in Loss</StatLabel>
                <StatNumber>{summary.loss}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Number of Stocks Data Unavailable</StatLabel>
                <StatNumber>{summary.unavailable}</StatNumber>
              </Stat>
            </HStack>
          </Box>
          {holdings.map((holding) => (
            <Box
              key={holding.name}
              p={5}
              shadow="md"
              borderWidth="1px"
              width="100%"
            >
              <Heading fontSize="xl">{holding.name}</Heading>
              <Divider my={2} />
              <HStack spacing={10} justifyContent="space-between">
                <Stat>
                  <StatLabel>Live Price</StatLabel>
                  <StatNumber>{holding.livePrice?.toFixed(2)}</StatNumber>
                </Stat>
                <Divider orientation="vertical" height="50px" />
                <Stat>
                  <StatLabel>{"Yesterday's Close"}</StatLabel>
                  <StatNumber>{holding.previousClose?.toFixed(2)}</StatNumber>
                </Stat>
                <Divider orientation="vertical" height="50px" />
                <Stat
                  color={holding.dayChangePerc >= 0 ? 'green.500' : 'red.500'}
                >
                  <StatLabel>Day Change</StatLabel>
                  <StatNumber>{holding.dayChange?.toFixed(2)}</StatNumber>
                </Stat>
                <Divider orientation="vertical" height="50px" />
                <Stat
                  color={holding.dayChangePerc >= 0 ? 'green.500' : 'red.500'}
                >
                  <StatLabel>Day Change %</StatLabel>
                  <StatNumber>{`${holding.dayChangePerc?.toFixed(
                    2
                  )}%`}</StatNumber>
                  <StatHelpText>
                    {holding.dayChangePerc >= 0 ? 'Gain' : 'Loss'}
                  </StatHelpText>
                </Stat>
                <Divider orientation="vertical" height="50px" />
                <Stat>
                  <StatLabel>Percentage Holdings</StatLabel>
                  <StatNumber>{`${holding.percentage?.toFixed(
                    2
                  )}%`}</StatNumber>
                </Stat>
              </HStack>
            </Box>
          ))}
        </VStack>
      ) : (
        ''
      )}
      {loading && selectedFund != '' && (
        <Progress size="lg" colorScheme="teal" width="60%" value={progress} />
      )}
      {error && (
        <Alert status="error" mt={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
    </VStack>
  );
};

export default LiveMutualFund;
