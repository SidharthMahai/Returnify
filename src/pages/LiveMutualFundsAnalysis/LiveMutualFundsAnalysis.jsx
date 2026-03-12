import { useRef, useState } from 'react';
import axios from 'axios';
import { InfoIcon, TimeIcon, ViewIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertIcon,
  Box,
  Container,
  Divider,
  Grid,
  Heading,
  HStack,
  Icon,
  Progress,
  Select,
  SimpleGrid,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import _ from 'lodash';
import { mutualFunds } from '../../constants/mutualfunds';
import Hero from '../../components/Hero/Hero';

const LiveMutualFund = () => {
  const panelStyle = {
    borderWidth: '1px',
    borderColor: useColorModeValue('whiteAlpha.700', 'whiteAlpha.200'),
    bg: useColorModeValue('rgba(255, 255, 255, 0.78)', 'rgba(15, 27, 45, 0.8)'),
    backdropFilter: 'blur(16px)',
    borderRadius: '3xl',
    boxShadow: useColorModeValue('glass', 'glassDark'),
  };
  const mutedText = useColorModeValue('ink.600', 'whiteAlpha.700');
  const primaryText = useColorModeValue('ink.900', 'whiteAlpha.900');
  const selectBg = useColorModeValue('white', 'surface.800');
  const progressBg = useColorModeValue('surface.100', 'whiteAlpha.200');
  const hoverShadow = useColorModeValue('soft', 'glassDark');
  const statLabelStyle = {
    fontSize: 'xs',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: mutedText,
  };

  const [selectedFund, setSelectedFund] = useState('');
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState({
    gain: 0,
    loss: 0,
    unavailable: 0,
  });
  const [overallGainLoss, setOverallGainLoss] = useState(null);
  const [recommendation, setRecommendation] = useState('N/A');
  const [allMutualFundData, setAllMutualFundData] = useState([]);
  const [cachedData, setCachedData] = useState({});
  const symbolCacheRef = useRef({});

  const requestGet = (url) => {
    return axios.get('/api/groww-proxy', {
      params: {
        url,
        method: 'GET',
      },
    });
  };

  const requestPost = (url, data) => {
    return axios.post('/api/groww-proxy', {
      url,
      method: 'POST',
      data,
    });
  };

  const getBseScriptCode = async (stockSearchId) => {
    if (!stockSearchId) {
      return null;
    }

    if (symbolCacheRef.current[stockSearchId]) {
      return symbolCacheRef.current[stockSearchId];
    }

    const symbolResponse = await requestGet(
      `https://groww.in/v1/api/stocks_data/v1/company/search_id/${stockSearchId}`
    );
    const bseScriptCode = symbolResponse?.data?.header?.bseScriptCode || null;
    symbolCacheRef.current[stockSearchId] = bseScriptCode;
    return bseScriptCode;
  };

  const getLivePriceMap = async (priceSymbolList, onProgress = () => {}) => {
    if (!priceSymbolList.length) {
      onProgress(1);
      return {};
    }

    const CHUNK_SIZE = 35;
    const mergedPriceMap = {};
    let processedSymbols = 0;

    const bumpProgress = (count) => {
      processedSymbols += count;
      onProgress(Math.min(processedSymbols / priceSymbolList.length, 1));
    };

    const fetchPriceBatch = async (symbols) => {
      const priceResponse = await requestPost(
        'https://groww.in/v1/api/stocks_data/v1/tr_live_delayed/segment/CASH/latest_aggregated',
        {
          exchangeAggReqMap: {
            NSE: { priceSymbolList: [], indexSymbolList: [] },
            BSE: { priceSymbolList: symbols, indexSymbolList: [] },
          },
        }
      );

      return priceResponse?.data?.exchangeAggRespMap?.BSE?.priceLivePointsMap || {};
    };

    for (let i = 0; i < priceSymbolList.length; i += CHUNK_SIZE) {
      const batch = priceSymbolList.slice(i, i + CHUNK_SIZE);

      try {
        const batchMap = await fetchPriceBatch(batch);
        Object.assign(mergedPriceMap, batchMap);
        bumpProgress(batch.length);
      } catch (batchError) {
        // If a large payload fails, gracefully degrade to single-symbol calls.
        for (const symbol of batch) {
          try {
            const singleMap = await fetchPriceBatch([symbol]);
            Object.assign(mergedPriceMap, singleMap);
          } catch (singleError) {
            // Continue with remaining symbols.
          } finally {
            bumpProgress(1);
          }
        }
      }
    }

    return mergedPriceMap;
  };

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
    setAllMutualFundData([]);
    setOverallGainLoss(null);
    setRecommendation('N/A');

    if (selected === 'SelectAll') {
      fetchAllMutualFunds();
    } else if (selected) {
      fetchHoldings(selected);
    }
  };

  const fetchHoldings = async (fundKey) => {
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      setProgress(8);
      const holdingsResponse = await requestGet(
        `https://groww.in/v1/api/data/mf/web/v4/scheme/search/${fundKey}`
      );
      const companyHoldingDetails = holdingsResponse.data.holdings;
      setProgress(18);

      const totalHoldings = Math.max(companyHoldingDetails.length, 1);
      let resolvedSymbols = 0;
      const enrichedHoldings = await Promise.all(
        companyHoldingDetails.map(async (holding) => {
          const bseScriptCode = await getBseScriptCode(holding.stock_search_id);
          resolvedSymbols += 1;
          setProgress(18 + (resolvedSymbols / totalHoldings) * 42);
          return {
            ...holding,
            bseScriptCode,
          };
        })
      );

      const uniqueCodes = [
        ...new Set(
          enrichedHoldings
            .map((holding) => holding.bseScriptCode)
            .filter(Boolean)
        ),
      ];
      const priceMap = await getLivePriceMap(uniqueCodes, (fraction) => {
        setProgress(60 + fraction * 32);
      });

      const updatedHoldings = [];
      let gain = 0;
      let loss = 0;
      let unavailable = 0;
      let weightedGainLossSum = 0;

      for (let i = 0; i < enrichedHoldings.length; i++) {
        const holding = enrichedHoldings[i];
        const priceInfo = holding.bseScriptCode
          ? priceMap[holding.bseScriptCode]
          : null;

        updatedHoldings.push({
          name: holding.company_name,
          percentage: holding.corpus_per,
          livePrice: priceInfo ? priceInfo.ltp : null,
          previousClose: priceInfo ? priceInfo.close : null,
          dayChange: priceInfo ? priceInfo.dayChange : null,
          dayChangePerc: priceInfo ? priceInfo.dayChangePerc : null,
        });

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
      }

      setHoldings(updatedHoldings);
      setSummary({ gain, loss, unavailable });
      setOverallGainLoss(weightedGainLossSum);
      setRecommendation(weightedGainLossSum < -1 ? 'Yep' : 'Meh');
      setCachedData((prevData) => ({
        ...prevData,
        [fundKey]: { key: fundKey, weightedGainLossSum },
      }));
      setProgress(96);
      setProgress(100);
    } catch (fetchError) {
      setHoldings([]);
      setOverallGainLoss(null);
      setRecommendation('N/A');
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
    const allData = [];
    const totalFunds = Math.max(mutualFundKeys.length, 1);

    for (let fundIndex = 0; fundIndex < mutualFundKeys.length; fundIndex++) {
      const key = mutualFundKeys[fundIndex];
      const fundStart = (fundIndex / totalFunds) * 100;
      const fundEnd = ((fundIndex + 1) / totalFunds) * 100;
      const setFundProgress = (fraction) => {
        setProgress(fundStart + (fundEnd - fundStart) * fraction);
      };

      if (!cachedData[key]) {
        try {
          setFundProgress(0.05);
          const response = await requestGet(
            `https://groww.in/v1/api/data/mf/web/v4/scheme/search/${key}`
          );
          const companyHoldingDetails = response.data.holdings;
          setFundProgress(0.12);

          const totalHoldings = Math.max(companyHoldingDetails.length, 1);
          let resolvedSymbols = 0;
          const enrichedHoldings = await Promise.all(
            companyHoldingDetails.map(async (holding) => {
              const bseScriptCode = await getBseScriptCode(
                holding.stock_search_id
              );
              resolvedSymbols += 1;
              setFundProgress(0.12 + (resolvedSymbols / totalHoldings) * 0.46);
              return {
                ...holding,
                bseScriptCode,
              };
            })
          );

          const uniqueCodes = [
            ...new Set(
              enrichedHoldings
                .map((holding) => holding.bseScriptCode)
                .filter(Boolean)
            ),
          ];
          const priceMap = await getLivePriceMap(uniqueCodes, (fraction) => {
            setFundProgress(0.58 + fraction * 0.36);
          });

          let weightedGainLossSum = 0;
          enrichedHoldings.forEach((holding) => {
            const priceInfo = holding.bseScriptCode
              ? priceMap[holding.bseScriptCode]
              : null;
            if (priceInfo) {
              const holdingWeight = holding.corpus_per / 100;
              weightedGainLossSum += holdingWeight * priceInfo.dayChangePerc;
            }
          });

          allData.push({ key, weightedGainLossSum });
          setFundProgress(1);
        } catch (fetchError) {
          setAllMutualFundData([]);
          setError('Failed to fetch data');
        }
      } else {
        allData.push(cachedData[key]);
        setFundProgress(1);
      }
    }

    setAllMutualFundData(allData);
    setProgress(100);
    setLoading(false);
  };

  return (
    <Stack spacing={{ base: 8, md: 10 }} pb={16}>
      <Hero
        eyebrow="Live NAV calculator"
        title="See what your mutual fund is up to before the official NAV strolls in."
        description="Pick one fund for the gossip, or scan all of them and see which ones are having a good day, a bad day, or a dramatic day."
      />

      <Container maxW="7xl">
        <Stack spacing={6}>
          <Box {...panelStyle} p={{ base: 5, md: 7 }}>
            <Grid templateColumns={{ base: '1fr', lg: '1.3fr 0.7fr' }} gap={6} alignItems="end">
              <Box>
                <HStack spacing={3} mb={2}>
                  <Icon as={ViewIcon} boxSize={4} color="brand.500" />
                  <Text fontSize="sm" textTransform="uppercase" letterSpacing="0.14em" color="brand.700" fontWeight="800">
                    Fund picker
                  </Text>
                </HStack>
                <Heading size="lg" mb={2} color={primaryText}>
                  Choose one fund or go full nosy
                </Heading>
                <Text color={mutedText} mb={5}>
                  One fund gives you holding-level detail. &quot;Select all&quot; gives you the leaderboard for the whole gang.
                </Text>
                <Select
                  value={selectedFund}
                  onChange={handleFundChange}
                  placeholder="Select Mutual Fund"
                  size="lg"
                  bg={selectBg}
                  maxW={{ base: 'full', md: '32rem' }}
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
              </Box>

              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                <Box borderRadius="2xl" borderWidth="1px" borderColor="whiteAlpha.300" p={4}>
                  <HStack spacing={2} mb={1}>
                    <Icon as={ViewIcon} color="brand.500" />
                    <Text color={mutedText} fontSize="sm">Funds</Text>
                  </HStack>
                  <Text fontSize="3xl" fontWeight="800" color={primaryText}>
                    {mutualFunds.length}
                  </Text>
                </Box>
                <Box borderRadius="2xl" borderWidth="1px" borderColor="whiteAlpha.300" p={4}>
                  <HStack spacing={2} mb={1}>
                    <Icon as={TimeIcon} color="brand.500" />
                    <Text color={mutedText} fontSize="sm">Signal</Text>
                  </HStack>
                  <Text fontSize="3xl" fontWeight="800" color={primaryText}>
                    Live-ish vibes
                  </Text>
                </Box>
              </SimpleGrid>
            </Grid>
          </Box>

          {loading && selectedFund !== '' && (
            <Box {...panelStyle} p={{ base: 5, md: 6 }}>
              <Text fontWeight="700" mb={3} color={primaryText}>
                Crunching numbers and bothering the internet
              </Text>
              <Progress
                size="lg"
                borderRadius="full"
                bg={progressBg}
                colorScheme="blue"
                value={progress}
              />
              <Text mt={3} color={mutedText}>
                {progress.toFixed(0)}% complete
              </Text>
            </Box>
          )}

          {error && (
            <Alert status="error" borderRadius="2xl">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {!loading && !error && selectedFund === 'SelectAll' && (
              <Stack spacing={4}>
                {allMutualFundData.map((fundData) => {
                const score = fundData.weightedGainLossSum;

                return (
                  <Box
                    key={fundData.key}
                    {...panelStyle}
                    p={6}
                    cursor="pointer"
                    onClick={() => handleFundChange({ target: { value: fundData.key } })}
                    _hover={{ transform: 'translateY(-4px)', boxShadow: hoverShadow }}
                    transition="all 200ms ease"
                  >
                    <Heading fontSize="xl" mb={3} color={primaryText}>
                      {mutualFunds.find((mf) => mf.key === fundData.key).name}
                    </Heading>
                    <Divider mb={4} />
                    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                      <Stat>
                        <StatLabel {...statLabelStyle}>Overall day change</StatLabel>
                        <StatNumber fontSize="3xl" color={score >= 0 ? 'green.500' : 'red.500'}>
                          {score ? `${score.toFixed(2)}%` : 'N/A'}
                        </StatNumber>
                        <StatHelpText>{score >= 0 ? 'Having a decent day' : 'Slightly grumpy'}</StatHelpText>
                      </Stat>
                      <Stat>
                        <StatLabel {...statLabelStyle}>Buy today?</StatLabel>
                        <StatNumber fontSize="3xl">{score < -1 ? 'Yep' : 'Maybe not'}</StatNumber>
                        <StatHelpText>Click for the juicy details</StatHelpText>
                      </Stat>
                    </SimpleGrid>
                  </Box>
                );
              })}
              </Stack>
          )}

          {!loading &&
            !error &&
            selectedFund !== '' &&
            selectedFund !== 'SelectAll' && (
            <Stack spacing={5}>
              <Box {...panelStyle} p={{ base: 5, md: 6 }}>
                <HStack spacing={3} mb={4}>
                  <Icon as={InfoIcon} boxSize={4} color="brand.500" />
                  <Heading fontSize="xl" color={primaryText}>
                    Quick summary
                  </Heading>
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 2, xl: 5 }} spacing={4}>
                  <Stat>
                    <StatLabel {...statLabelStyle}>Live gain/loss</StatLabel>
                    <StatNumber fontSize="3xl" color={overallGainLoss >= 0 ? 'green.500' : 'red.500'}>
                      {overallGainLoss !== null ? `${overallGainLoss.toFixed(2)}%` : 'N/A'}
                    </StatNumber>
                    <StatHelpText>
                      {overallGainLoss >= 0 ? 'Mostly behaving' : 'A little wobbly'}
                    </StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel {...statLabelStyle}>Buy today?</StatLabel>
                    <StatNumber fontSize="3xl">{recommendation}</StatNumber>
                    <StatHelpText>Our tiny rule: below -1%</StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel {...statLabelStyle}>Stocks in gain</StatLabel>
                    <StatNumber fontSize="3xl">{summary.gain}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel {...statLabelStyle}>Stocks in loss</StatLabel>
                    <StatNumber fontSize="3xl">{summary.loss}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel {...statLabelStyle}>No data</StatLabel>
                    <StatNumber fontSize="3xl">{summary.unavailable}</StatNumber>
                  </Stat>
                </SimpleGrid>
              </Box>

              <Stack spacing={4}>
                {holdings.map((holding) => (
                  <Box key={holding.name} {...panelStyle} p={{ base: 5, md: 6 }}>
                    <HStack justify="space-between" align="flex-start" mb={4} spacing={4}>
                      <Box>
                        <Heading fontSize={{ base: 'lg', md: 'xl' }} mb={1} color={primaryText}>
                          {holding.name}
                        </Heading>
                        <HStack spacing={2}>
                          <Text {...statLabelStyle}>Holding weight</Text>
                          <Text color="brand.500" fontWeight="800" fontSize="lg">
                            {holding.percentage?.toFixed(2) ?? 'N/A'}%
                          </Text>
                        </HStack>
                      </Box>
                    </HStack>
                    <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={3}>
                      <Box borderRadius="xl" borderWidth="1px" borderColor="whiteAlpha.300" p={4}>
                        <Text {...statLabelStyle}>Live price</Text>
                        <Text fontSize="2xl" fontWeight="800" color={primaryText}>
                          {holding.livePrice?.toFixed(2) ?? 'N/A'}
                        </Text>
                      </Box>
                      <Box borderRadius="xl" borderWidth="1px" borderColor="whiteAlpha.300" p={4}>
                        <Text {...statLabelStyle}>Yesterday close</Text>
                        <Text fontSize="2xl" fontWeight="800" color={primaryText}>
                          {holding.previousClose?.toFixed(2) ?? 'N/A'}
                        </Text>
                      </Box>
                      <Box borderRadius="xl" borderWidth="1px" borderColor="whiteAlpha.300" p={4}>
                        <Text {...statLabelStyle}>Day change</Text>
                        <Text
                          fontSize="2xl"
                          fontWeight="800"
                          color={holding.dayChangePerc >= 0 ? 'green.500' : 'red.500'}
                        >
                          {holding.dayChange?.toFixed(2) ?? 'N/A'}
                        </Text>
                      </Box>
                      <Box borderRadius="xl" borderWidth="1px" borderColor="whiteAlpha.300" p={4}>
                        <Text {...statLabelStyle}>Day change %</Text>
                        <Text
                          fontSize="2xl"
                          fontWeight="800"
                          color={holding.dayChangePerc >= 0 ? 'green.500' : 'red.500'}
                        >
                          {holding.dayChangePerc !== null && holding.dayChangePerc !== undefined
                            ? `${holding.dayChangePerc.toFixed(2)}%`
                            : 'N/A'}
                        </Text>
                        <Text fontSize="sm" color={mutedText}>
                          {holding.dayChangePerc >= 0 ? 'Up' : 'Down'}
                        </Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                ))}
              </Stack>
            </Stack>
          )}
        </Stack>
      </Container>
    </Stack>
  );
};

export default LiveMutualFund;
