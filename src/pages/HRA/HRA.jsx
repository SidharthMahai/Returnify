import {
  FormControl,
  FormLabel,
  HStack,
  Container,
  Radio,
  RadioGroup,
  Button,
  Select,
  Center,
} from '@chakra-ui/react';
import './exemptions.css';
import './myLib.css';
import { useState } from 'react';
import CustomTable from '../../components/CustomTable/CustomTable';

function HouseRentAllowance() {
  let [basicSalaryReceived, setBasicSalary] = useState(0);
  let [daReceived, setDaReceived] = useState(0);
  let [hraReceived, setHraReceived] = useState(0);
  let [rentPaid, setRentPaid] = useState(0);
  let [isMetroCity, setIsMetroCity] = useState(1);
  let [isError, setError] = useState(false);
  let [arr, setArr] = useState([]);
  let [exemptedAmount, setExemptedAmount] = useState(0);
  let [hasMultipleValues, sethasMultipleValues] = useState(0);
  let [chargeableTotax, setChargeableTotax] = useState(0);
  let [columns, setColumns] = useState([]);
  let [rows, setRows] = useState([{}]);
  let [bulkRows, setBulkRows] = useState([
    { id: 1, rowValues: ['', '', '', '', '', '', ''] },
  ]);
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

  let [fromMonth, setFromMonth] = useState();
  let [toMonth, setToMonth] = useState();
  let [toMonthDisabled, setToMonthDisabled] = useState(1);

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
    setArr([]);
    setColumns([]);
    setRows([{}]);
    setExemptedAmount(0);
    setChargeableTotax(0);
    if (hasMultipleValues !== 1 && (BS < 1 || HRA < 1 || RP < 1)) {
      setError(true);
    } else {
      setError(false);
      var columns = [];
      columns.push('Calculation');
      columns.push('Value');
      setColumns(columns);
      if (hasMultipleValues && bulkRows.length >= 1 && bulkRows[0].id !== 1) {
        var exempted = 0;
        var chargeable = 0;
        var allRows = [];
        bulkRows.forEach((row) => {
          exempted += calculateHRAExemption(
            row.rowValues[2],
            row.rowValues[0],
            row.rowValues[1],
            row.rowValues[3],
            row.rowValues[4]
          );
          chargeable +=
            row.rowValues[2] -
            calculateHRAExemption(
              row.rowValues[2],
              row.rowValues[0],
              row.rowValues[1],
              row.rowValues[3],
              row.rowValues[4]
            );
          var valuesArray = returnHRAFormulaValues(
            row.rowValues[2],
            row.rowValues[0],
            row.rowValues[1],
            row.rowValues[3],
            row.rowValues[4]
          );
          var newRows = [];
          var rowid = 0;
          var calcs = [
            'Actual HRA received',
            '50%/40% of basic + DA',
            'Rent paid - 10% of (Basic + DA)',
          ];
          calcs.forEach((calc, index) => {
            newRows.push({
              id: rowid++,
              values: [
                calc + ' (' + row.rowValues[5] + ' - ' + row.rowValues[6] + ')',
                valuesArray[index],
              ],
            });
          });
          newRows.push({
            id: rowid++,
            values: [
              'Exempted for month/s ' +
                row.rowValues[5] +
                ' - ' +
                row.rowValues[6],
              calculateHRAExemption(
                row.rowValues[2],
                row.rowValues[0],
                row.rowValues[1],
                row.rowValues[3],
                row.rowValues[4]
              ),
            ],
          });
          newRows.push({
            id: rowid++,
            values: [
              'Chargeable for month/s ' +
                row.rowValues[5] +
                ' - ' +
                row.rowValues[6],
              row.rowValues[2] -
                calculateHRAExemption(
                  row.rowValues[2],
                  row.rowValues[0],
                  row.rowValues[1],
                  row.rowValues[3],
                  row.rowValues[4]
                ),
            ],
          });
          allRows.push(newRows);
        });
        setArr(allRows);
        setExemptedAmount(exempted);
        setChargeableTotax(chargeable);
      } else {
        var rows = [];
        var id = 0;
        rows.push({
          id: id++,
          values: ['Actual HRA received', HRA],
        });
        let sumOfBPAndDA = BS + DA;
        rows.push({
          id: id++,
          values: [
            '50%/40% of basic + DA',
            isMetroCity ? (50 / 100) * sumOfBPAndDA : (40 / 100) * sumOfBPAndDA,
          ],
        });
        rows.push({
          id: id++,
          values: [
            'Rent paid - 10% of (Basic + DA)',
            RP - (10 / 100) * sumOfBPAndDA,
          ],
        });
        let exemption = calculateHRAExemption(HRA, BS, DA, RP, isMetroCity);
        rows.push({
          id: id++,
          values: ['Exempted from HRA for year', exemption],
        });
        rows.push({
          id: id++,
          values: ['Chargeable to tax for year', HRA - exemption],
        });
        setRows(rows);
        setExemptedAmount(exemption);
        setChargeableTotax(HRA - exemption);
      }
    }
  }

  return (
    <Container centerContent>
      <Center>
        <FormControl>
          <FormLabel>Do you have multiple values for year?</FormLabel>
          <RadioGroup onChange={setMultipleValueChanges}>
            <HStack spacing="24px">
              <Radio value="1">Yes</Radio>
              <Radio value="0">No</Radio>
            </HStack>
          </RadioGroup>
        </FormControl>
      </Center>
      {hasMultipleValues ? (
        <div>
          <div className="row">
            <div className="col-md-6">
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
            </div>
            <div className="col-md-6">
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
            </div>
            <div className="col-md-6">
              <FormControl isRequired>
                <FormLabel>Basic Salary Received</FormLabel>
                <input
                  type="number"
                  className="form-control"
                  value={basicSalaryReceived}
                  onChange={(e) => setBasicSalary(e.target.value)}
                />
              </FormControl>
            </div>
            <div className="col-md-6">
              <FormControl isRequired>
                <FormLabel>DA Received</FormLabel>
                <input
                  type="number"
                  className="form-control"
                  value={daReceived}
                  onChange={(e) => setDaReceived(e.target.value)}
                />
              </FormControl>
            </div>
            <div className="col-md-6">
              <FormControl isRequired>
                <FormLabel>HRA Received</FormLabel>
                <input
                  type="number"
                  className="form-control"
                  value={hraReceived}
                  onChange={(e) => setHraReceived(e.target.value)}
                />
              </FormControl>
            </div>
            <div className="col-md-6">
              <FormControl isRequired>
                <FormLabel>Rent Paid</FormLabel>
                <input
                  type="number"
                  className="form-control"
                  value={rentPaid}
                  onChange={(e) => setRentPaid(e.target.value)}
                />
              </FormControl>
            </div>
            <div className="col-md-6">
              <FormControl isRequired>
                <FormLabel>Metro City?</FormLabel>
                <RadioGroup onChange={setIsMetroCity} value={isMetroCity}>
                  <HStack spacing="24px">
                    <Radio value={1}>Yes</Radio>
                    <Radio value={0}>No</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
            </div>
            <div className="col-md-6">
              <Button onClick={addNewValueInTable} colorScheme="teal">
                Add
              </Button>
            </div>
          </div>
          <div className="row">
            <CustomTable
              columns={bulkColumns}
              rows={bulkRows}
              onEdit={onChangeEdit}
              onDelete={onChangeDelete}
            />
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-6">
            <FormControl isRequired>
              <FormLabel>Basic Salary Received</FormLabel>
              <input
                type="number"
                className="form-control"
                value={basicSalaryReceived}
                onChange={(e) => setBasicSalary(e.target.value)}
              />
            </FormControl>
          </div>
          <div className="col-md-6">
            <FormControl isRequired>
              <FormLabel>DA Received</FormLabel>
              <input
                type="number"
                className="form-control"
                value={daReceived}
                onChange={(e) => setDaReceived(e.target.value)}
              />
            </FormControl>
          </div>
          <div className="col-md-6">
            <FormControl isRequired>
              <FormLabel>HRA Received</FormLabel>
              <input
                type="number"
                className="form-control"
                value={hraReceived}
                onChange={(e) => setHraReceived(e.target.value)}
              />
            </FormControl>
          </div>
          <div className="col-md-6">
            <FormControl isRequired>
              <FormLabel>Rent Paid</FormLabel>
              <input
                type="number"
                className="form-control"
                value={rentPaid}
                onChange={(e) => setRentPaid(e.target.value)}
              />
            </FormControl>
          </div>
          <div className="col-md-6">
            <FormControl isRequired>
              <FormLabel>Metro City?</FormLabel>
              <RadioGroup onChange={setIsMetroCity} value={isMetroCity}>
                <HStack spacing="24px">
                  <Radio value={1}>Yes</Radio>
                  <Radio value={0}>No</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
          </div>
        </div>
      )}
      <Button
        onClick={calculateButtonClicked}
        colorScheme="teal"
        marginTop="20px"
      >
        Calculate HRA Exemption
      </Button>
      {isError && (
        <div className="alert alert-danger" role="alert">
          Please fill in all required fields correctly.
        </div>
      )}
      <CustomTable columns={columns} rows={rows} />
      {arr.map((rows, index) => (
        <CustomTable key={index} columns={columns} rows={rows} />
      ))}
      <div className="row">
        <div className="col-md-6">
          <FormLabel>Exempted Amount</FormLabel>
          <div>{exemptedAmount}</div>
        </div>
        <div className="col-md-6">
          <FormLabel>Chargeable to Tax</FormLabel>
          <div>{chargeableTotax}</div>
        </div>
      </div>
    </Container>
  );
}

export default HouseRentAllowance;
