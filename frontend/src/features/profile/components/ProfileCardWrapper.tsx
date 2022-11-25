import { memo, FC, Suspense, PropsWithChildren } from 'react';
import { Center, Spinner } from '@chakra-ui/react';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate } from 'react-router-dom';

export const ProfileCardWrapper: FC<PropsWithChildren> = memo((props) => {
  const { children } = props;

  return (
    // TODO: alert 出したい。あとContentLayout に入れてもいいかも
    // 開発中、勝手にページ遷移されるため、"."にしてます
    <ErrorBoundary fallback={<Navigate to="." replace={true} />}>
      <Suspense
        fallback={
          <Center h="100%">
            <Spinner emptyColor="gray.200" color="blue.500" size="xl" />
          </Center>
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
});
