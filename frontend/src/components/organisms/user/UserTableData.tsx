import { FC, memo } from 'react';
import { Tr, Td, Image } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

type Props = {
  login: string;
  imageUrl: string;
};

// const onClickGame = memo(() => {
//   // const navigate = useNavigate();
//   console.log('hello');

//   // navigate('/user-list', { replace: true });
// });

export const UserTableData: FC<Props> = memo((props) => {
  const { login, imageUrl } = props;

  return (
    <>
      <Tr>
        <Td>
          <Image boxSize="48px" src={imageUrl} alt={login} m="auto" />
        </Td>
        <Td>{login}</Td>
        <Td>
          <NavLink
            to={'/game'}
            state={{ loginUser: 'LoginUser', opponent: login }}
          >
            Game
          </NavLink>
        </Td>
        <Td>
          <NavLink
            to={'/direct-message'}
            state={{ loginUser: 'LoginUser', opponent: login }}
          >
            Message
          </NavLink>
        </Td>
      </Tr>
    </>
  );
});
