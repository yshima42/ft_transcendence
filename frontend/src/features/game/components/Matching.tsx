import { memo, FC } from 'react';
import { Box, Divider, Flex, Heading, Spinner, Stack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from 'components/atoms/button/PrimaryButton';

export const Matching: FC = memo(() => {
  const navigate = useNavigate();

  const onClickCancel = () => {
    navigate(-1);
  };

  // TODO: match cancelボタンの処理
  // TODO: Matching, Confirmation, Waitingを統一コンポーネントとする
  return (
    <Flex align="center" justify="center" height="40vh">
      <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          Now Matching...
        </Heading>
        <Divider />
        <Stack spacing={4} py={4} px={10} align="center">
          <Spinner />
          <PrimaryButton onClick={onClickCancel}>Cancel</PrimaryButton>
        </Stack>
      </Box>
    </Flex>
  );
});
