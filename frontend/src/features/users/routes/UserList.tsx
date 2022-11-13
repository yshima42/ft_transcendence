import { memo, FC, useEffect } from 'react';
import {
  Table,
  Tbody,
  Tfoot,
  Tr,
  Thead,
  TableContainer,
} from '@chakra-ui/react';
import { UserTableData } from 'features/users/components/UserTableData';
import { useAllUsers } from '../api/useAllUsers';

export const UserList: FC = memo(() => {
  const { getUsers, users } = useAllUsers();

  useEffect(() => getUsers(), [getUsers]);

  return (
    <>
      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr></Tr>
          </Thead>
          <Tbody>
            {users.map((users) => (
              <UserTableData
                key={users.id}
                imageUrl="https://source.unsplash.com/random"
                login={users.name}
              />
            ))}
          </Tbody>
          <Tfoot>
            <Tr></Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
  );
});
