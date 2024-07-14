import {
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
  Button,
  Select,
  Center,
  VStack,
  Box,
  Input,
  Heading,
  Divider,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useState } from 'react';
import CustomTable from '../../components/CustomTable/CustomTable';
import Hero from '../../components/Hero/Hero';
function HouseRentAllowance() {
  let [basicSalaryReceived, setBasicSalary] = useState(0);
  let [daReceived, setDaReceived] = useState(0);
  let [hraReceived, setHraReceived] = useState(0);
  let [rentPaid, setRentPaid] = useState(0);
  let [isMetroCity, setIsMetroCity] = useState(0);
  let [isError, setError] = useState(false);
  let [hasMultipleValues, sethasMultipleValues] = useState(0);
  let [columns, setColumns] = useState([]);
  let [rows, setRows] = useState([{}]);
  let [bulkRows, setBulkRows] = useState([
    { id: 1, rowValues: ['', '', '', '', '', '', ''] },
  ]);
  let [fromMonth, setFromMonth] = useState();
  let [toMonth, setToMonth] = useState();
  let [toMonthDisabled, setToMonthDisabled] = useState(1);

  let bulkColumns = [
    'Basic Salary',
    'DA Received',
    'HRA Received',
    'Rent Paid',
    'Is Metro City?',
    'From Month',
    'To Month',
  ];

  const months = [
    { monthNumber: 1, monthName: 'April' },
    { monthNumber: 2, monthName: 'May' },
    { monthNumber: 3, monthName: 'June' },
    { monthNumber: 4, monthName: 'July' },
    { monthNumber: 5, monthName: 'August' },
    { monthNumber: 6, monthName: 'September' },
    { monthNumber: 7, monthName: 'October' },
    { monthNumber: 8, monthName: 'November' },
    { monthNumber: 9, monthName: 'December' },
    { monthNumber: 10, monthName: 'January' },
    { monthNumber: 11, monthName: 'February' },
    { monthNumber: 12, monthName: 'March' },
  ];

  function fromMonthClick(monthNumber) {
    if (monthNumber === '') {
      // Do Nothing
    } else {
      setToMonthDisabled(0);
      setFromMonth(parseInt(monthNumber));
      if (toMonth < parseInt(monthNumber) && toMonth !== 0) {
        setToMonth(0);
      }
    }
  }

  function generateId() {
    const chars = '0123456789';
    let id = '';

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      id += chars[randomIndex];
    }

    return id;
  }

  function setMultipleValueChanges(value) {
    sethasMultipleValues(value);
  }

  function checkIfRowCanBeAdded() {
    var isValid = true;
    if (bulkRows.length >= 1 && bulkRows[0].id !== 1) {
      bulkRows.forEach((row) => {
        var existingfromMonth = months.filter(
          (a) => a.monthName === row.rowValues[5]
        );
        var existingtoMonth = months.filter(
          (a) => a.monthName === row.rowValues[6]
        );
        for (
          var x = existingfromMonth[0].monthNumber;
          x <= existingtoMonth[0].monthNumber;
          x++
        ) {
          if (fromMonth === x || toMonth === x) {
            isValid = false;
            return;
          }
        }
      });
    }
    return isValid;
  }

  function onChangeEdit(row) {
    setBulkRows(bulkRows.filter((a) => a.id != row.id));
    setBasicSalary(row.rowValues[0]);
    setDaReceived(row.rowValues[1]);
    setHraReceived(row.rowValues[2]);
    setRentPaid(row.rowValues[3]);
    setIsMetroCity(row.rowValues[4]);
    var fromMonth = months.map((m) => {
      if (m.monthNumber === row.rowValues[5]) return m.monthName;
    });
    var toMonth = months.map((m) => {
      if (m.monthNumber === row.rowValues[6]) return m.monthName;
    });
    setFromMonth(fromMonth);
    setToMonth(toMonth);
  }

  function onChangeDelete(row) {
    setBulkRows(bulkRows.filter((a) => a.id != row.id));
  }

  function addNewValueInTable() {
    var HRA = hraReceived === '' ? 0 : parseInt(hraReceived);
    var BS = basicSalaryReceived === '' ? 0 : parseInt(basicSalaryReceived);
    var DA = daReceived === '' ? 0 : parseInt(daReceived);
    var RP = rentPaid === '' ? 0 : parseInt(rentPaid);
    var MC = isMetroCity;
    if (BS < 1 || HRA < 1 || RP < 1) {
      setError(true);
    } else {
      setError(false);
      if (checkIfRowCanBeAdded()) {
        var tempRows = bulkRows;
        if (bulkRows.length === 1 && bulkRows[0].id === 1) tempRows = [];
        var newRow = {
          id: generateId(),
          rowValues: [
            BS,
            DA,
            HRA,
            RP,
            MC,
            months.find((a) => a.monthNumber === fromMonth).monthName,
            months.find((a) => a.monthNumber === toMonth).monthName,
          ],
        };
        tempRows.push(newRow);
        setBulkRows(tempRows);
        setBasicSalary(0);
        setHraReceived(0);
        setDaReceived(0);
        setRentPaid(0);
        setIsMetroCity(1);
        setFromMonth('April');
        setToMonth();
      } else {
        setError(true);
      }
    }
  }

  function toMonthClick(monthNumber) {
    if (monthNumber === '') {
      // Do Nothing
    } else {
      setToMonth(parseInt(monthNumber));
    }
  }

  function calculateHRAExemption(HRA, BS, DA, RP, isMetroCity) {
    var tempArr = [];
    var formulaOne = HRA;
    let sumOfBPAndDA = BS + DA;
    var formulaTwo = isMetroCity
      ? (50 / 100) * sumOfBPAndDA
      : (40 / 100) * sumOfBPAndDA;
    var formulaThree = RP - (10 / 100) * sumOfBPAndDA;
    tempArr.push(formulaOne);
    tempArr.push(formulaTwo);
    tempArr.push(formulaThree);
    return Math.min(...tempArr);
  }

  function returnHRAFormulaValues(HRA, BS, DA, RP, isMetroCity) {
    var tempArr = [];
    var formulaOne = HRA;
    let sumOfBPAndDA = BS + DA;
    var formulaTwo = isMetroCity
      ? (50 / 100) * sumOfBPAndDA
      : (40 / 100) * sumOfBPAndDA;
    var formulaThree = RP - (10 / 100) * sumOfBPAndDA;
    tempArr.push(formulaOne);
    tempArr.push(formulaTwo);
    tempArr.push(formulaThree);
    return tempArr;
  }

  function calculateButtonClicked() {
    var HRA = hraReceived === '' ? 0 : parseInt(hraReceived);
    var BS = basicSalaryReceived === '' ? 0 : parseInt(basicSalaryReceived);
    var DA = daReceived === '' ? 0 : parseInt(daReceived);
    var RP = rentPaid === '' ? 0 : parseInt(rentPaid);

    setColumns([]);
    setRows([{}]);

    if (hasMultipleValues == 0 && (BS < 1 || HRA < 1 || RP < 1)) {
      setError(true);
    } else {
      setError(false);
      var columns = [];
      columns.push('Calculation');
      columns.push('Value');
      setColumns(columns);
      if (
        hasMultipleValues != 0 &&
        bulkRows.length >= 1 &&
        bulkRows[0].id !== 1
      ) {
        var exempted = 0;
        var chargeable = 0;
        bulkRows.forEach((row) => {
          var existingfromMonth = months.filter(
            (a) => a.monthName === row.rowValues[5]
          );
          var existingtoMonth = months.filter(
            (a) => a.monthName === row.rowValues[6]
          );
          var numberOfMonths =
            existingtoMonth[0].monthNumber -
            existingfromMonth[0].monthNumber +
            1;

          var exemptedForRow =
            calculateHRAExemption(
              row.rowValues[2],
              row.rowValues[0],
              row.rowValues[1],
              row.rowValues[3],
              row.rowValues[4]
            ) * numberOfMonths;

          exempted += exemptedForRow;
          var chargeableForThis =
            row.rowValues[3] * numberOfMonths - exemptedForRow;
          chargeable += chargeableForThis;
        });

        var rows = [
          {
            id: 1,
            rowValues: ['HRA Exempted', exempted],
          },
          {
            id: 2,
            rowValues: ['HRA Chargeable to tax', chargeable],
          },
        ];

        setRows(rows);
      } else {
        var numberOfMonths = 12;
        var exempted2 =
          calculateHRAExemption(HRA, BS, DA, RP, isMetroCity) * numberOfMonths;
        var formulaValues = returnHRAFormulaValues(
          HRA,
          BS,
          DA,
          RP,
          isMetroCity
        );

        var chargeable2 = RP * numberOfMonths - exempted2;
        var percentage = isMetroCity ? '50%' : '40%';

        var rows2 = [
          {
            id: 1,
            rowValues: [
              'Actual HRA received',
              formulaValues[0] * numberOfMonths,
            ],
          },
          {
            id: 2,
            rowValues: [
              percentage + ' of Basic Salary',
              formulaValues[1] * numberOfMonths,
            ],
          },
          {
            id: 3,
            rowValues: [
              'Rent Paid in excess of 10% of salary',
              formulaValues[2] * numberOfMonths,
            ],
          },
          {
            id: 4,
            rowValues: ['HRA Exempted', exempted2],
          },
          {
            id: 5,
            rowValues: ['HRA Chargeable to tax', chargeable2],
          },
        ];

        setRows(rows2);
      }
    }
  }

  const clearAllValues = () => {
    setBasicSalary(0);
    setDaReceived(0);
    setHraReceived(0);
    setRentPaid(0);
    setIsMetroCity(0);
    setError(false);
    sethasMultipleValues(0);
    setColumns([]);
    setRows([{}]);
    setBulkRows([{ id: 1, rowValues: ['', '', '', '', '', '', ''] }]);
    setFromMonth(undefined);
    setToMonth(undefined);
    setToMonthDisabled(1);
  };

  return (
    <VStack spacing={10} minH="100vh" p={5}>
      <Hero
        title="HRA Exemption Calculator"
        description="Calculate your House Rent Allowance (HRA) exemption easily. Understand how much of your HRA is exempt from tax and optimize your salary structure."
      />
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" width="50%">
        <Heading as="h3" size="lg" mb={5} textAlign="center">
          Enter Details Here
        </Heading>
        <Divider mb={5} />
        <Center mb={5}>
          <FormControl>
            <FormLabel>Do you have multiple values for year?</FormLabel>
            <RadioGroup defaultValue="0" onChange={setMultipleValueChanges}>
              <HStack spacing="24px">
                <Radio value="1">Yes</Radio>
                <Radio value="0">No</Radio>
              </HStack>
            </RadioGroup>
          </FormControl>
        </Center>
        {hasMultipleValues != 0 ? (
          <>
            <HStack spacing={5} mb={5}>
              <FormControl isRequired>
                <FormLabel>From Month</FormLabel>
                <Select
                  value={fromMonth}
                  onChange={(e) => fromMonthClick(e.target.value)}
                  placeholder="Select From Month"
                >
                  {months.map((month) => (
                    <option key={month.monthNumber} value={month.monthNumber}>
                      {month.monthName}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>To Month</FormLabel>
                <Select
                  value={toMonth}
                  onChange={(e) => toMonthClick(e.target.value)}
                  placeholder="Select To Month"
                  isDisabled={toMonthDisabled}
                >
                  {months.map((month) => (
                    <option key={month.monthNumber} value={month.monthNumber}>
                      {month.monthName}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </HStack>
            <HStack spacing={5} mb={5}>
              <FormControl isRequired>
                <FormLabel>Basic Salary Received</FormLabel>
                <Input
                  type="number"
                  value={basicSalaryReceived}
                  onChange={(e) => setBasicSalary(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>DA Received</FormLabel>
                <Input
                  type="number"
                  value={daReceived}
                  onChange={(e) => setDaReceived(e.target.value)}
                />
              </FormControl>
            </HStack>
            <HStack spacing={5} mb={5}>
              <FormControl isRequired>
                <FormLabel>HRA Received</FormLabel>
                <Input
                  type="number"
                  value={hraReceived}
                  onChange={(e) => setHraReceived(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Rent Paid</FormLabel>
                <Input
                  type="number"
                  value={rentPaid}
                  onChange={(e) => setRentPaid(e.target.value)}
                />
              </FormControl>
            </HStack>
            <HStack spacing={5} mb={5}>
              <FormControl isRequired>
                <FormLabel>Metro City?</FormLabel>
                <RadioGroup defaultValue="0" onChange={setIsMetroCity}>
                  <HStack spacing="24px">
                    <Radio value="1">Yes</Radio>
                    <Radio value="0">No</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
              <Button onClick={addNewValueInTable} colorScheme="teal" mt={8}>
                Add
              </Button>
            </HStack>
            <CustomTable
              columns={bulkColumns}
              rows={bulkRows}
              onEdit={onChangeEdit}
              onDelete={onChangeDelete}
            />
          </>
        ) : (
          <>
            <HStack spacing={5} mb={5}>
              <FormControl isRequired>
                <FormLabel>Basic Salary Received</FormLabel>
                <Input
                  type="number"
                  value={basicSalaryReceived}
                  onChange={(e) => setBasicSalary(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>DA Received</FormLabel>
                <Input
                  type="number"
                  value={daReceived}
                  onChange={(e) => setDaReceived(e.target.value)}
                />
              </FormControl>
            </HStack>
            <HStack spacing={5} mb={5}>
              <FormControl isRequired>
                <FormLabel>HRA Received</FormLabel>
                <Input
                  type="number"
                  value={hraReceived}
                  onChange={(e) => setHraReceived(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Rent Paid</FormLabel>
                <Input
                  type="number"
                  value={rentPaid}
                  onChange={(e) => setRentPaid(e.target.value)}
                />
              </FormControl>
            </HStack>
            <HStack spacing={5} mb={5}>
              <FormControl isRequired>
                <FormLabel>Metro City?</FormLabel>
                <RadioGroup defaultValue="0" onChange={setIsMetroCity}>
                  <HStack spacing="24px">
                    <Radio value="1">Yes</Radio>
                    <Radio value="0">No</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
            </HStack>
          </>
        )}
        <Center>
          <Button
            onClick={calculateButtonClicked}
            colorScheme="teal"
            mt={5}
            mr={3}
          >
            Calculate HRA Exemption
          </Button>
          <Button onClick={clearAllValues} colorScheme="red" mt={5} ml={3}>
            Clear Values
          </Button>
        </Center>
        {isError && (
          <Alert status="error" mt={5}>
            <AlertIcon />
            Please fill in all required fields correctly.
          </Alert>
        )}
        <CustomTable columns={columns} rows={rows} />
      </Box>
    </VStack>
  );
}

export default HouseRentAllowance;
