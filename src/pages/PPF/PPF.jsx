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
  Center,
  VStack,
} from '@chakra-ui/react';
import Hero from '../../components/Hero/Hero';

const PPF = () => {
  const [investment, setInvestment] = useState(500);
  const [years, setYears] = useState(15);
  const [valueChange, setValueChange] = useState(false);
  const [PPFList, setPPFList] = useState([]);
  const [amountInvested, setAmountInvested] = useState(0);
  const [maturityAmount, setMaturityAmount] = useState(0);
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    calculateReturnsOnPPF(investment, years);
  }, [investment, years]);

  const onInputChange = (value) => {
    setValueChange(true);
    setInvestment(value);
  };

  const onYearChange = (value) => {
    setValueChange(true);
    setYears(value);
  };

  const calculateReturnsOnPPF = (investmentYearly, years) => {
    const list = [];
    for (let x = 0; x < years; x++) {
      const obj = {};
      if (x === 0) {
        obj.year = new Date().getFullYear();
        obj.newInvestment = investmentYearly;
        obj.totalInvestment = investmentYearly;
        obj.interest = Math.round(0.071 * obj.totalInvestment);
        obj.investmentIncludingInterest = obj.totalInvestment + obj.interest;
        list.push(obj);
      } else {
        obj.year = list[x - 1].year + 1;
        obj.newInvestment = investmentYearly;
        obj.totalInvestment =
          investmentYearly + list[x - 1].investmentIncludingInterest;
        obj.interest = Math.round(0.071 * obj.totalInvestment);
        obj.investmentIncludingInterest = obj.totalInvestment + obj.interest;
        list.push(obj);
      }
    }

    setPPFList(list);
    setAmountInvested(list.reduce((acc, obj) => acc + obj.newInvestment, 0));
    setMaturityAmount(list[years - 1].investmentIncludingInterest);
    setProfit(list[years - 1].investmentIncludingInterest - amountInvested);
  };

  return (
    <VStack spacing={10} minH="100vh">
      <Hero
        title="PPF Returns Calculator"
        description="Estimate the returns on your Public Provident Fund (PPF) investments. Plan your savings and understand the growth of your PPF account over time."
      />
      <Center py={10} w="full">
        <Box className="card">
          <Box className="card-body">
            <Box className="cover-container h-100 p-3 mx-auto flex-column">
              <main role="main" className="inner cover">
                <Text fontSize="2xl" className="heading1">
                  Calculate Returns on PPF
                </Text>
                <br />
                <br />
                <Text fontSize="xl" className="heading">
                  Rate of Interest
                </Text>
                <Text>7.1%</Text>
                <br />
                <br />
                <Text fontSize="xl" className="heading">
                  Yearly Investment in PPF
                </Text>
                <Slider
                  aria-label="investment-slider"
                  value={investment}
                  min={500}
                  max={150000}
                  step={500}
                  onChange={onInputChange}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                <Text>{`₹${investment}`}</Text>
                <br />
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
                {valueChange && (
                  <>
                    <br />
                    <br />
                    <Text fontSize="xl" className="heading">
                      Amount you Invested: {`₹${amountInvested}`}
                    </Text>
                    <br />
                    <br />
                    <Text fontSize="xl" className="heading">
                      Total Amount including Interest: {`₹${maturityAmount}`}
                    </Text>
                    <br />
                    <br />
                    <Text fontSize="xl" className="heading">
                      Profit: {`₹${profit}`}
                    </Text>
                    <br />
                    <br />
                    <Accordion allowToggle>
                      <AccordionItem>
                        <h2>
                          <AccordionButton>
                            <Box flex="1" textAlign="left">
                              Want to Understand how this {`₹${maturityAmount}`}{' '}
                              got to be?
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
                                  Invested value in start of year(B = A of this
                                  year + D of last year)
                                </Th>
                                <Th>
                                  Interest gained for this year(C = Interest on
                                  B)
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
              </main>
            </Box>
          </Box>
        </Box>
      </Center>
    </VStack>
  );
};

export default PPF;
