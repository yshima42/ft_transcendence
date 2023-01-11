import { memo, FC } from 'react';
import { useGameRoomId } from 'hooks/utils/useGameRoomId';
import { useUserPresence } from 'hooks/utils/useUserPresence';
import { GameButton } from 'components/atoms/button/GameButton';
import { WatchButton } from 'components/atoms/button/WatchButton';
import { Presence } from 'providers/SocketProvider';

type Props = {
  loginUserId: string;
  targetId: string;
};

// targetIdがオンラインなら対戦申し込み(Game)ボタン、ゲーム中なら観戦(Watch)ボタン、オフラインなら何も表示しない
export const GameOrWatchButton: FC<Props> = memo((props) => {
  const { loginUserId, targetId } = props;
  const { presence } = useUserPresence(targetId);
  const { gameRoomId } = useGameRoomId(targetId);
  const { gameRoomId: loginUserGameRoomId } = useGameRoomId(loginUserId);
  const isPlayer = gameRoomId === loginUserGameRoomId;

  if (presence === Presence.OFFLINE) {
    return <></>;
  } else if (presence === Presence.ONLINE) {
    return loginUserGameRoomId === undefined ? (
      <GameButton targetId={targetId} />
    ) : (
      <></>
    );
  } else {
    return gameRoomId === undefined ? (
      <></>
    ) : (
      <WatchButton gameRoomId={gameRoomId} isPlayer={isPlayer} />
    );
  }
});
