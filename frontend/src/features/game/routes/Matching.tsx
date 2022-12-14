import { memo, FC, useState } from 'react';
import { Box, Divider, Flex, Heading, Spinner, Stack } from '@chakra-ui/react';
// import { useEffect } from '@storybook/addons';
// import { SOCKET_URL } from 'config/default';
import { useNavigate } from 'react-router-dom';
// import { io, Socket } from 'socket.io-client';
import { PrimaryButton } from 'components/atoms/button/PrimaryButton';
import { ContentLayout } from 'components/ecosystems/ContentLayout';

export const Matching: FC = memo(() => {
  const navigate = useNavigate();
  // const [matched, setMatched] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // const onClickMatch = () => {
  //   setMatched(true);
  //   setTimeout(() => navigate('/app/game'), 0 * 1000);
  // };

  const onClickCancel = () => {
    setIsConfirmed(false);
    navigate(-1);
  };

  // TODO: match cancelボタンの処理
  // 今後コンポーネント分割するべき
  return (
    <>
      <ContentLayout title="">
        <Flex align="center" justify="center" height="40vh">
          <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
            {isConfirmed ? (
              <Heading as="h1" size="lg" textAlign="center">
                Preparing...
              </Heading>
            ) : (
              <Heading as="h1" size="lg" textAlign="center">
                Now Matching...
              </Heading>
            )}
            <Divider />
            <Stack spacing={4} py={4} px={10} align="center">
              {isConfirmed ? <Box>Starting in 0 seconds</Box> : <Spinner />}
              <PrimaryButton onClick={onClickCancel} disabled={isConfirmed}>
                Cancel
              </PrimaryButton>
            </Stack>
          </Box>
        </Flex>
      </ContentLayout>
    </>
  );
});
