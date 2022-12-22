import { memo, FC } from 'react';
import { Button } from '@chakra-ui/react';
import {
  InvitationState,
  useInvitationGame,
} from 'features/profile/hooks/useInvitationGame';

type Props = {
  targetId: string;
  size?: string;
};

export const GameButton: FC<Props> = memo((props) => {
  const { targetId, size = 'sm' } = props;
  const { setInvitationState, setOpponentId } = useInvitationGame();

  const onClickGame = () => {
    setOpponentId(targetId);
    setInvitationState(InvitationState.Inviting);
  };

  return (
    <Button mr={2} size={size} onClick={onClickGame}>
      Game
    </Button>
  );
});
