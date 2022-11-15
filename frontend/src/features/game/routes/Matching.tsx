import { memo, FC, useState } from 'react';
import { Box, Divider, Flex, Heading, Spinner, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from 'components/atoms/button/PrimaryButton';

export const Matching: FC = memo(() => {
  const navigate = useNavigate();
  const [matched, setMatched] = useState(false);

  const onClickMatch = () => {
    setMatched(true);
    setTimeout(() => navigate('/app/game'), 3 * 1000);
  };

  const onClickCancel = () => {
    navigate(-1);
  };

  return (
    <>
      <Flex align="center" justify="center" height="40vh">
        <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
          {matched ? (
            <Heading as="h1" size="lg" textAlign="center">
              対戦準備中
            </Heading>
          ) : (
            <Heading as="h1" size="lg" textAlign="center">
              マッチング中
            </Heading>
          )}
          <Divider />
          <Stack spacing={4} py={4} px={10} align="center">
            {matched ? <Box>3秒で始まります</Box> : <Spinner />}
            {matched ? (
              <></>
            ) : (
              <PrimaryButton
                onClick={onClickMatch}
                loading={matched}
                disabled={matched}
              >
                マッチングしたと仮定する
              </PrimaryButton>
            )}
            <PrimaryButton onClick={onClickCancel} disabled={matched}>
              キャンセル
            </PrimaryButton>
          </Stack>
        </Box>
      </Flex>
    </>
  );
});
