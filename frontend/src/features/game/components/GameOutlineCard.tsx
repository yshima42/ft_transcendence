import { memo, FC } from 'react';
import { Button, Card, Flex, Spacer, Text, VStack } from '@chakra-ui/react';
import { useProfile } from 'hooks/api';
import { useNavigate } from 'react-router-dom';
import { LinkedNickname } from 'components/atoms/text/LinkedNickname';
import { UserAvatar } from 'components/organisms/avatar/UserAvatar';
import { GameOutline } from '../hooks/useGameMonitoring';

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
        <VStack alignItems={'center'}>
          <UserAvatar id={user1.id} src={user1.avatarImageUrl} />
          <LinkedNickname
            id={user1.id}
            nickname={user1.nickname}
            maxWidth={200}
          />
        </VStack>
        <Spacer />
        <Text fontSize="xl">vs</Text>
        <Spacer />
        <VStack>
          <UserAvatar id={user2.id} src={user2.avatarImageUrl} />
          <LinkedNickname
            id={user2.id}
            nickname={user2.nickname}
            maxWidth={200}
          />
        </VStack>
        <Spacer />
        <Button onClick={() => navigate(`/app/games/${gameOutline.roomId}`)}>
          {isPlayer ? 'Reconnect' : 'Watch'}
        </Button>
      </Flex>
    </Card>
  );
});

/* <Card bg="white" w="sm" borderRadius="md" shadow="md"> */
