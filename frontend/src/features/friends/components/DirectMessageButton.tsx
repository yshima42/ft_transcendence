import { FC } from 'react';
import { ChatIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
// import { useDirectMessage } from '../api/useDirectMessage';

type Props = {
  id: string;
};

export const DirectMessageButton: FC<Props> = (props) => {
  // const { directMessage } = useDirectMessage();
  const { id } = props;

  // const onClickDirectMessage = () => {
  //   directMessage(id);
  // };

  return (
    <Link to={`/app/dm/${id}`}>
      <ChatIcon boxSize={5} />
    </Link>
  );
};
