import { memo, FC, useState } from 'react';
import { Box, Divider, Flex, Heading, Spinner, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from 'components/button/PrimaryButton';
import { ContentLayout } from 'components/layout/ContentLayout';

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

  // 今後コンポーネント分割するべき
  return (
    <>
      <ContentLayout title="">
        <Flex align="center" justify="center" height="40vh">
          <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
            {matched ? (
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
              {matched ? <Box>Starting in 3 seconds</Box> : <Spinner />}
              {matched ? (
                <></>
              ) : (
                <PrimaryButton
                  onClick={onClickMatch}
                  loading={matched}
                  disabled={matched}
                >
                  Assume matching!
                </PrimaryButton>
              )}
              <PrimaryButton onClick={onClickCancel} disabled={matched}>
                Cancel
              </PrimaryButton>
            </Stack>
          </Box>
        </Flex>
      </ContentLayout>
    </>
  );
});
