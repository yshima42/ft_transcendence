import { memo, FC } from 'react';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { useGameMonitoring } from '../hooks/useGameMonitoring';

export const Games: FC = memo(() => {
  const { inGameOutlines } = useGameMonitoring();

  return (
    <ContentLayout title="In-Game List">
      {inGameOutlines.map((inGameOutline) => (
        <>
          <p>{inGameOutline.roomId} </p>
          <p>{inGameOutline.leftPlayerId} </p>
          <p>{inGameOutline.rightPlayerId} </p>
        </>
      ))}
    </ContentLayout>
  );
});
