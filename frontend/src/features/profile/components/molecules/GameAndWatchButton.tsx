import { memo, FC } from 'react';
import { useGameRoomId } from 'hooks/utils/useGameRoomId';
import { GameButton } from 'components/atoms/button/GameButton';
import { WatchButton } from 'components/atoms/button/WatchButton';

type Props = {
  targetId: string;
};

// targetIdがオンラインなら対戦申し込み(Game)ボタン、ゲーム中なら観戦(Watch)ボタン、オフラインなら何も表示しない
export const GameAndWatchButton: FC<Props> = memo((props) => {
  const { targetId } = props;
  const { gameRoomId } = useGameRoomId(targetId);

  return (
    <>
      {gameRoomId === '' && <GameButton targetId={targetId} />}
      {gameRoomId !== undefined && gameRoomId !== '' && (
        <WatchButton gameRoomId={gameRoomId} />
      )}
    </>
  );
});
