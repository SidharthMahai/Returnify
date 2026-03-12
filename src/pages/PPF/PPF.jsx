import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Container,
  Grid,
  Heading,
  HStack,
  Radio,
  RadioGroup,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import Hero from '../../components/Hero/Hero';

const PpfCalculatorPage = () => {
  const panelStyle = {
    borderWidth: '1px',
    borderColor: useColorModeValue('whiteAlpha.700', 'whiteAlpha.200'),
    bg: useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(15, 27, 45, 0.8)'),
    backdropFilter: 'blur(18px)',
    borderRadius: '3xl',
    boxShadow: useColorModeValue('glass', 'glassDark'),
  };
  const tileBg = useColorModeValue('surface.50', 'whiteAlpha.120');
  const mutedText = useColorModeValue('ink.600', 'whiteAlpha.700');
  const primaryText = useColorModeValue('ink.900', 'whiteAlpha.900');
  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  const [investment, setInvestment] = useState(500);
  const [years, setYears] = useState(15);
  const [frequency, setFrequency] = useState('Yearly');
  const [PPFList, setPPFList] = useState([]);
  const [amountInvested, setAmountInvested] = useState(0);
  const [maturityAmount, setMaturityAmount] = useState(0);
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    calculateReturnsOnPPF(investment, years, frequency);
  }, [investment, years, frequency]);

  const calculateReturnsOnPPF = (
    investmentAmount,
    investmentYears,
    investmentFrequency
  ) => {
    const list = [];
    const annualInterestRate = 0.071;
    const monthlyInterestRate = annualInterestRate / 12;
    let totalInvestment = 0;
    let investmentIncludingInterest = 0;

    for (let year = 1; year <= investmentYears; year++) {
      const yearlyData = { year: new Date().getFullYear() + year - 1 };
      let newInvestment = 0;
      let interest = 0;

      if (investmentFrequency === 'Monthly') {
        for (let month = 1; month <= 12; month++) {
          newInvestment += investmentAmount;
          interest += investmentIncludingInterest * monthlyInterestRate;
          investmentIncludingInterest +=
            investmentAmount +
            investmentIncludingInterest * monthlyInterestRate;
        }
      } else {
        newInvestment = investmentAmount;
        interest =
          (investmentIncludingInterest + newInvestment) * annualInterestRate;
        investmentIncludingInterest += newInvestment + interest;
      }

      yearlyData.newInvestment = newInvestment;
      yearlyData.totalInvestment = totalInvestment + newInvestment;
      yearlyData.interest = Math.round(interest);
      yearlyData.investmentIncludingInterest = Math.round(
        investmentIncludingInterest
      );
      totalInvestment += newInvestment;
      list.push(yearlyData);
    }

    setPPFList(list);
    setAmountInvested(totalInvestment);
    setMaturityAmount(list[investmentYears - 1].investmentIncludingInterest);
    setProfit(
      list[investmentYears - 1].investmentIncludingInterest - totalInvestment
    );
  };

  return (
    <Stack spacing={{ base: 8, md: 10 }} pb={16}>
      <Hero
        eyebrow="PPF calculator"
        title="Your PPF, but without opening six tabs and pretending you enjoy that."
        description="Pick monthly or yearly deposits, drag the sliders, and let the calculator do the compounding math while you do something more fun."
      />

      <Container maxW="7xl">
        <Grid
          templateColumns={{ base: '1fr', xl: '0.9fr 1.1fr' }}
          gap={6}
          alignItems="start"
        >
          <Box {...panelStyle} p={{ base: 5, md: 7 }} alignSelf="start">
            <Stack spacing={6}>
              <Box>
                <Text fontSize="sm" textTransform="uppercase" letterSpacing="0.14em" color="brand.700" fontWeight="800" mb={2}>
                  PPF knobs
                </Text>
                <Heading size="lg" color={primaryText}>
                  Turn the money dials
                </Heading>
              </Box>

              <Box>
                <Text fontSize="sm" color={mutedText} mb={2}>
                  Rate of Interest
                </Text>
                <Text fontSize="3xl" fontWeight="800" color={primaryText}>
                  7.1%
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" color={mutedText} mb={3}>
                  Investment Frequency
                </Text>
                <RadioGroup onChange={setFrequency} value={frequency}>
                  <HStack spacing={3} flexWrap="wrap">
                    <Box
                      px={4}
                      py={3}
                      borderRadius="2xl"
                      bg={frequency === 'Monthly' ? 'brand.500' : tileBg}
                      color={frequency === 'Monthly' ? 'white' : primaryText}
                    >
                      <Radio value="Monthly" colorScheme="blue">
                        Monthly
                      </Radio>
                    </Box>
                    <Box
                      px={4}
                      py={3}
                      borderRadius="2xl"
                      bg={frequency === 'Yearly' ? 'brand.500' : tileBg}
                      color={frequency === 'Yearly' ? 'white' : primaryText}
                    >
                      <Radio value="Yearly" colorScheme="blue">
                        Yearly
                      </Radio>
                    </Box>
                  </HStack>
                </RadioGroup>
              </Box>

              <Box>
                <HStack justify="space-between" mb={3}>
                  <Text fontSize="sm" color={mutedText}>
                    {frequency} deposit
                  </Text>
                  <Text fontWeight="800" color={primaryText}>
                    {formatCurrency(investment)}
                  </Text>
                </HStack>
                <Slider
                  aria-label="investment-slider"
                  value={investment}
                  min={frequency === 'Monthly' ? 100 : 500}
                  max={frequency === 'Monthly' ? 12500 : 150000}
                  step={frequency === 'Monthly' ? 100 : 500}
                  onChange={setInvestment}
                >
                  <SliderTrack bg={useColorModeValue('surface.100', 'whiteAlpha.200')}>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Box>

              <Box>
                <HStack justify="space-between" mb={3}>
                  <Text fontSize="sm" color={mutedText}>
                    Number of years
                  </Text>
                  <Text fontWeight="800" color={primaryText}>
                    {years} years
                  </Text>
                </HStack>
                <Slider
                  aria-label="years-slider"
                  value={years}
                  min={15}
                  max={50}
                  step={1}
                  onChange={setYears}
                >
                  <SliderTrack bg={useColorModeValue('surface.100', 'whiteAlpha.200')}>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Box>
            </Stack>
          </Box>

          <Stack spacing={6}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Box {...panelStyle} p={5}>
                <Stat>
                  <StatLabel>What you put in</StatLabel>
                  <StatNumber fontSize="2xl">{formatCurrency(amountInvested)}</StatNumber>
                  <StatHelpText>The part your wallet remembers.</StatHelpText>
                </Stat>
              </Box>
              <Box {...panelStyle} p={5}>
                <Stat>
                  <StatLabel>What it grows to</StatLabel>
                  <StatNumber fontSize="2xl">{formatCurrency(maturityAmount)}</StatNumber>
                  <StatHelpText>The future version with better posture.</StatHelpText>
                </Stat>
              </Box>
              <Box {...panelStyle} p={5}>
                <Stat>
                  <StatLabel>Extra money made</StatLabel>
                  <StatNumber fontSize="2xl" color="green.500">
                    {formatCurrency(profit)}
                  </StatNumber>
                  <StatHelpText>Compounding doing its slow wizard thing.</StatHelpText>
                </Stat>
              </Box>
            </SimpleGrid>

            <Box {...panelStyle} p={{ base: 5, md: 6 }}>
              <Heading fontSize="xl" mb={4} color={primaryText}>
                Quick snapshot
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box borderRadius="2xl" bg={tileBg} p={5}>
                  <Text color={mutedText} fontSize="sm">
                    Deposit mode
                  </Text>
                  <Text fontSize="2xl" fontWeight="800" mt={1} color={primaryText}>
                    {frequency}
                  </Text>
                </Box>
                <Box borderRadius="2xl" bg={tileBg} p={5}>
                  <Text color={mutedText} fontSize="sm">
                    Final year
                  </Text>
                  <Text fontSize="2xl" fontWeight="800" mt={1} color={primaryText}>
                    {PPFList[PPFList.length - 1]?.year ?? new Date().getFullYear()}
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>

            <Box {...panelStyle} p={{ base: 5, md: 6 }}>
              <Accordion allowToggle>
                <AccordionItem border="none">
                  <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
                    <Box flex="1" textAlign="left">
                      <Heading fontSize="lg" color={primaryText}>
                        Show me the yearly receipts for {formatCurrency(maturityAmount)}
                      </Heading>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel px={0} pt={4}>
                    <Box overflowX="auto">
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Year</Th>
                            <Th>New Investment</Th>
                            <Th>Total Invested</Th>
                            <Th>Interest Earned</Th>
                            <Th>Year-end Value</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {PPFList.map((inv) => (
                            <Tr key={inv.year}>
                              <Td>{inv.year}</Td>
                              <Td>{formatCurrency(inv.newInvestment)}</Td>
                              <Td>{formatCurrency(inv.totalInvestment)}</Td>
                              <Td>{formatCurrency(inv.interest)}</Td>
                              <Td>{formatCurrency(inv.investmentIncludingInterest)}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>
          </Stack>
        </Grid>
      </Container>
    </Stack>
  );
};

export default PpfCalculatorPage;
