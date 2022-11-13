import React from 'react';
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

type TableColumn<Entry> = {
  title: string;
  Cell: ({ entry }: { entry: Entry }) => React.ReactElement;
};

export type TableProps<Entry> = {
  data: Entry[];
  columns: Array<TableColumn<Entry>>;
};

export const PrimaryTable = <Entry extends { id: string }>({
  data,
  columns,
}: TableProps<Entry>): React.ReactElement => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            {columns.map((column, index) => (
              <Th key={column.title + index.toString()}>{column.title}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((entry, entryIndex) => (
            <Tr key={entryIndex}>
              {columns.map(({ Cell, title }, columnIndex) => {
                return (
                  <Td key={title + columnIndex.toString()}>
                    <Cell entry={entry} />
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
