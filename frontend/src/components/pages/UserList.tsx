import { memo, FC } from 'react';
import {
  Table,
  Tbody,
  Tfoot,
  Tr,
  Th,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react';
import { UserTableData } from 'components/organisms/user/UserTableData';

export const UserList: FC = memo(() => {
  return (
    <>
      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <TableCaption>Imperial to metric conversion factors</TableCaption>
          {/* <Thead>
            <Tr>
              <Th>Login</Th>
              <Th>Photo</Th>
              <Th></Th>
            </Tr>
          </Thead> */}
          <Tbody>
            {[...Array<string>(10)].map((_, index) => (
              <>
                <UserTableData
                  login={`hyoshie${index}`}
                  photo={`hogehoge${index}.com`}
                />
              </>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
  );
});
