import { useState } from 'react';
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
  const tileBg = useColorModeValue('surface.50', 'whiteAlpha.120');
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
      const holdingsResponse = await requestGet(
        `https://groww.in/v1/api/data/mf/web/v4/scheme/search/${fundKey}`
      );
      const companyHoldingDetails = holdingsResponse.data.holdings;

      const totalHoldings = companyHoldingDetails.length;
      const updatedHoldings = [];
      let gain = 0;
      let loss = 0;
      let unavailable = 0;
      let weightedGainLossSum = 0;

      for (let i = 0; i < totalHoldings; i++) {
        const holding = companyHoldingDetails[i];

        if (holding.stock_search_id) {
          const symbolResponse = await requestGet(
            `https://groww.in/v1/api/stocks_data/v1/company/search_id/${holding.stock_search_id}`
          );
          const { bseScriptCode } = symbolResponse.data.header;
          holding.bseScriptCode = bseScriptCode;
        }

        const priceResponse = await requestPost(
          'https://groww.in/v1/api/stocks_data/v1/tr_live_delayed/segment/CASH/latest_aggregated',
          {
            exchangeAggReqMap: {
              NSE: { priceSymbolList: [], indexSymbolList: [] },
              BSE: { priceSymbolList: [holding.bseScriptCode], indexSymbolList: [] },
            },
          }
        );

        const priceData =
          priceResponse.data.exchangeAggRespMap.BSE.priceLivePointsMap;

        const priceInfo = holding.bseScriptCode
          ? priceData[holding.bseScriptCode]
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

        setProgress(((i + 1) / totalHoldings) * 100);
      }

      setHoldings(updatedHoldings);
      setSummary({ gain, loss, unavailable });
      setOverallGainLoss(weightedGainLossSum);
      setRecommendation(weightedGainLossSum < -1 ? 'Yep' : 'Meh');
      setCachedData((prevData) => ({
        ...prevData,
        [fundKey]: { key: fundKey, weightedGainLossSum },
      }));
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

    for (const key of mutualFundKeys) {
      if (!cachedData[key]) {
        try {
          const response = await requestGet(
            `https://groww.in/v1/api/data/mf/web/v4/scheme/search/${key}`
          );
          const companyHoldingDetails = response.data.holdings;

          const totalHoldings = companyHoldingDetails.length;
          let weightedGainLossSum = 0;

          for (let i = 0; i < totalHoldings; i++) {
            const holding = companyHoldingDetails[i];

            if (holding.stock_search_id) {
              const symbolResponse = await requestGet(
                `https://groww.in/v1/api/stocks_data/v1/company/search_id/${holding.stock_search_id}`
              );
              const { bseScriptCode } = symbolResponse.data.header;
              holding.bseScriptCode = bseScriptCode;
            }

            const priceResponse = await requestPost(
              'https://groww.in/v1/api/stocks_data/v1/tr_live_delayed/segment/CASH/latest_aggregated',
              {
                exchangeAggReqMap: {
                  NSE: { priceSymbolList: [], indexSymbolList: [] },
                  BSE: { priceSymbolList: [holding.bseScriptCode], indexSymbolList: [] },
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

          allData.push({ key, weightedGainLossSum });
        } catch (fetchError) {
          setAllMutualFundData([]);
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
                <Box borderRadius="2xl" bg={tileBg} p={4}>
                  <HStack spacing={2} mb={1}>
                    <Icon as={ViewIcon} color="brand.500" />
                    <Text color={mutedText} fontSize="sm">Funds</Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="800" color={primaryText}>
                    {mutualFunds.length}
                  </Text>
                </Box>
                <Box borderRadius="2xl" bg={tileBg} p={4}>
                  <HStack spacing={2} mb={1}>
                    <Icon as={TimeIcon} color="brand.500" />
                    <Text color={mutedText} fontSize="sm">Signal</Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="800" color={primaryText}>
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
                        <Text color={mutedText} fontSize="sm">
                          Holding weight: {holding.percentage?.toFixed(2) ?? 'N/A'}%
                        </Text>
                      </Box>
                    </HStack>
                    <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={3}>
                      <Box borderRadius="xl" bg={tileBg} p={4}>
                        <Text {...statLabelStyle}>Live price</Text>
                        <Text fontSize="2xl" fontWeight="800" color={primaryText}>
                          {holding.livePrice?.toFixed(2) ?? 'N/A'}
                        </Text>
                      </Box>
                      <Box borderRadius="xl" bg={tileBg} p={4}>
                        <Text {...statLabelStyle}>Yesterday close</Text>
                        <Text fontSize="2xl" fontWeight="800" color={primaryText}>
                          {holding.previousClose?.toFixed(2) ?? 'N/A'}
                        </Text>
                      </Box>
                      <Box borderRadius="xl" bg={tileBg} p={4}>
                        <Text {...statLabelStyle}>Day change</Text>
                        <Text
                          fontSize="2xl"
                          fontWeight="800"
                          color={holding.dayChangePerc >= 0 ? 'green.500' : 'red.500'}
                        >
                          {holding.dayChange?.toFixed(2) ?? 'N/A'}
                        </Text>
                      </Box>
                      <Box borderRadius="xl" bg={tileBg} p={4}>
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
