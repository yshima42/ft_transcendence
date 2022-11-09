import { memo, FC, useEffect } from 'react';
import {
  Table,
  Tbody,
  Tfoot,
  Tr,
  Thead,
  TableContainer,
} from '@chakra-ui/react';
import { UserTableData } from 'components/organisms/user/UserTableData';
import { useAllUsers } from '../../hooks/useAllUsers';

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
                login={users.name}
                photo={users.id}
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
