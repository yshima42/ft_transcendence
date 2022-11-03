import { FC, memo } from 'react';
import { Tr, Td } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

type Props = {
  login: string;
  photo: string;
};

// const onClickGame = memo(() => {
//   // const navigate = useNavigate();
//   console.log('hello');

//   // navigate('/user-list', { replace: true });
// });

export const UserTableData: FC<Props> = memo((props) => {
  const { login, photo } = props;

  return (
    <>
      <Tr>
        <Td>{login}</Td>
        <Td>{photo}</Td>
        <Td>
          <NavLink to={'/game'}>Game</NavLink>
        </Td>
        <Td>Message</Td>
      </Tr>
    </>
  );
});
