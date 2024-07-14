import { useState, useEffect } from 'react';
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Radio,
  RadioGroup,
  HStack,
  Heading,
  Divider,
} from '@chakra-ui/react';
import Hero from '../../components/Hero/Hero';

const PPF = () => {
  const [investment, setInvestment] = useState(500);
  const [years, setYears] = useState(15);
  const [frequency, setFrequency] = useState('Yearly');
  const [valueChange, setValueChange] = useState(false);
  const [PPFList, setPPFList] = useState([]);
  const [amountInvested, setAmountInvested] = useState(0);
  const [maturityAmount, setMaturityAmount] = useState(0);
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    calculateReturnsOnPPF(investment, years, frequency);
  }, [investment, years, frequency]);

  const onInputChange = (value) => {
    setValueChange(true);
    setInvestment(value);
  };

  const onYearChange = (value) => {
    setValueChange(true);
    setYears(value);
  };

  const calculateReturnsOnPPF = (investmentAmount, years, frequency) => {
    const list = [];
    const annualInterestRate = 0.071;
    const monthlyInterestRate = annualInterestRate / 12;
    let totalInvestment = 0;
    let investmentIncludingInterest = 0;

    for (let year = 1; year <= years; year++) {
      const yearlyData = { year: new Date().getFullYear() + year - 1 };
      let newInvestment = 0;
      let interest = 0;

      if (frequency === 'Monthly') {
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
    setMaturityAmount(list[years - 1].investmentIncludingInterest);
    setProfit(list[years - 1].investmentIncludingInterest - totalInvestment);
  };

  return (
    <VStack spacing={10} minH="100vh" p={5}>
      <Hero
        title="PPF Returns Calculator"
        description="Estimate the returns on your Public Provident Fund (PPF) investments. Plan your savings and understand the growth of your PPF account over time."
      />
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" width="50%">
        <Heading as="h3" size="lg" mb={5} textAlign="center">
          Calculate Returns on PPF
        </Heading>
        <Divider mb={5} />
        <Box mb={5}>
          <Text fontSize="xl" className="heading">
            Rate of Interest
          </Text>
          <Text>7.1%</Text>
        </Box>
        <Box mb={5}>
          <Text fontSize="xl" className="heading">
            Investment Frequency
          </Text>
          <RadioGroup onChange={setFrequency} value={frequency}>
            <HStack spacing={5}>
              <Radio value="Monthly">Monthly</Radio>
              <Radio value="Yearly">Yearly</Radio>
            </HStack>
          </RadioGroup>
        </Box>
        <Box mb={5}>
          <Text fontSize="xl" className="heading">
            {frequency} Investment in PPF
          </Text>
          <Slider
            aria-label="investment-slider"
            value={investment}
            min={frequency === 'Monthly' ? 100 : 500}
            max={frequency === 'Monthly' ? 12500 : 150000}
            step={frequency === 'Monthly' ? 100 : 500}
            onChange={onInputChange}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Text>{`₹${investment}`}</Text>
        </Box>
        <Box mb={5}>
          <Text fontSize="xl" className="heading">
            Number of Years
          </Text>
          <Slider
            aria-label="years-slider"
            value={years}
            min={15}
            max={50}
            step={1}
            onChange={onYearChange}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Text>{years}</Text>
        </Box>
        {valueChange && (
          <>
            <Box mb={5}>
              <Text fontSize="xl" fontWeight="bold" className="heading">
                Amount you Invested: {`₹${amountInvested}`}
              </Text>
            </Box>
            <Box mb={5}>
              <Text fontSize="xl" fontWeight="bold" className="heading">
                Total Amount including Interest: {`₹${maturityAmount}`}
              </Text>
            </Box>
            <Box mb={5}>
              <Text fontSize="xl" fontWeight="bold" className="heading">
                Profit: {`₹${profit}`}
              </Text>
            </Box>
            <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Want to Understand how this {`₹${maturityAmount}`} got to
                      be?
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Year</Th>
                        <Th>Amount you invested(A)</Th>
                        <Th>
                          Invested value in start of year(B = A of this year + D
                          of last year)
                        </Th>
                        <Th>
                          Interest gained for this year(C = Interest on B)
                        </Th>
                        <Th>Total value at end of year(D = B + C)</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {PPFList.map((inv, index) => (
                        <Tr key={index}>
                          <Td>{inv.year}</Td>
                          <Td>{inv.newInvestment}</Td>
                          <Td>{inv.totalInvestment}</Td>
                          <Td>{inv.interest}</Td>
                          <Td>{inv.investmentIncludingInterest}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </Box>
    </VStack>
  );
};

export default PPF;
