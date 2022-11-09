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
            {users.map((jsonUsers) => (
              <UserTableData
                key={jsonUsers.id}
                login={jsonUsers.username}
                photo={jsonUsers.website}
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
