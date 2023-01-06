import { memo, FC } from 'react';
import { useGameRoomId } from 'hooks/utils/useGameRoomId';
import { useUserPresence } from 'hooks/utils/useUserPresence';
import { GameButton } from 'components/atoms/button/GameButton';
import { WatchButton } from 'components/atoms/button/WatchButton';
import { Presence } from 'providers/SocketProvider';

type Props = {
  targetId: string;
};

// targetIdがオンラインなら対戦申し込み(Game)ボタン、ゲーム中なら観戦(Watch)ボタン、オフラインなら何も表示しない
export const GameOrWatchButton: FC<Props> = memo((props) => {
  const { targetId } = props;
  const { presence } = useUserPresence(targetId);
  const { gameRoomId } = useGameRoomId(targetId);

  return presence === Presence.OFFLINE ? (
    <></>
  ) : presence === Presence.ONLINE ? (
    <GameButton targetId={targetId} />
  ) : gameRoomId === undefined ? (
    <></>
  ) : (
    <WatchButton gameRoomId={gameRoomId} />
  );
});
