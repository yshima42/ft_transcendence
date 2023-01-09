import { memo, FC } from 'react';
import { Button, Card, Flex, Spacer, Text } from '@chakra-ui/react';
import { useProfile } from 'hooks/api';
import { useNavigate } from 'react-router-dom';
import { GameOutline } from '../hooks/useGameMonitoring';
import { AvatarWithNickname } from './AvatarWithNickname';

type Props = {
  gameOutline: GameOutline;
};

export const GameOutlineCard: FC<Props> = memo((props) => {
  const { gameOutline } = props;
  const { user } = useProfile();
  const isPlayer =
    user.id === gameOutline.player1Id || user.id === gameOutline.player2Id;
  const { user: user1 } = useProfile(gameOutline.player1Id);
  const { user: user2 } = useProfile(gameOutline.player2Id);
  const navigate = useNavigate();

  return (
    <Card borderRadius="md" w="lg">
      <Flex alignItems="center" p={4}>
        <Spacer />
        <AvatarWithNickname user={user1} />
        <Spacer />
        <Text fontSize="xl">vs</Text>
        <Spacer />
        <AvatarWithNickname user={user2} />
        <Spacer />
        <Button
          onClick={() => navigate(`/app/game/rooms/${gameOutline.roomId}`)}
        >
          {isPlayer ? 'Reconnect' : 'Watch'}
        </Button>
      </Flex>
    </Card>
  );
});
