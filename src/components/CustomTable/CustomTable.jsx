import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  IconButton,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';

function CustomTable({
  columns,
  rows,
  actions = false,
  onChangeEdit,
  onChangeDelete,
  heading,
}) {
  return (
    <TableContainer>
      <Table variant="striped" colorScheme="teal">
        {heading && <TableCaption>{heading}</TableCaption>}
        <Thead>
          <Tr>
            {columns?.map((e, index) => (
              <Th key={index}>{e}</Th>
            ))}
            {actions && <Th>Actions</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row) => (
            <Tr key={row.id}>
              {row?.rowValues?.map((e, index) => (
                <Td key={index}>{e}</Td>
              ))}
              {actions && row.rowValues.length > 0 && (
                <Td>
                  <IconButton
                    style={{ marginRight: 3 }}
                    colorScheme="blue"
                    icon={<EditIcon />}
                    onClick={() => onChangeEdit(row)}
                  />
                  <IconButton
                    colorScheme="red"
                    icon={<DeleteIcon />}
                    onClick={() => onChangeDelete(row)}
                  />
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

CustomTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string),
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      rowValues: PropTypes.arrayOf(PropTypes.any),
    })
  ).isRequired,
  actions: PropTypes.bool,
  onChangeEdit: PropTypes.func,
  onChangeDelete: PropTypes.func,
  heading: PropTypes.string,
};

export default CustomTable;
