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
  const { user: leftPlayer } = useProfile(gameOutline.leftPlayerId);
  const { user: rightPlayer } = useProfile(gameOutline.rightPlayerId);
  const navigate = useNavigate();

  return (
    <Card borderRadius="md" w="lg">
      <Flex alignItems="center" p={4}>
        <Spacer />
        <VStack alignItems={'center'}>
          <UserAvatar id={leftPlayer.id} src={leftPlayer.avatarImageUrl} />
          <LinkedNickname
            id={leftPlayer.id}
            nickname={leftPlayer.nickname}
            maxWidth={200}
          />
        </VStack>
        <Spacer />
        <Text fontSize="xl">vs</Text>
        <Spacer />
        <VStack>
          <UserAvatar id={rightPlayer.id} src={rightPlayer.avatarImageUrl} />
          <LinkedNickname
            id={rightPlayer.id}
            nickname={rightPlayer.nickname}
            maxWidth={200}
          />
        </VStack>
        <Spacer />
        <Button onClick={() => navigate(`/app/games/${gameOutline.roomId}`)}>
          Watch
        </Button>
      </Flex>
    </Card>
  );
});

/* <Card bg="white" w="sm" borderRadius="md" shadow="md"> */
