import { memo, FC } from 'react';
import { Box, Divider, Flex, Heading, Spinner, Stack } from '@chakra-ui/react';
import { PrimaryButton } from 'components/atoms/button/PrimaryButton';
import { MatchState } from '../hooks/useGameMatching';

type Props = {
  setMatchState: React.Dispatch<React.SetStateAction<MatchState>>;
};

export const Matching: FC<Props> = memo((props) => {
  const { setMatchState } = props;

  const onClickCancel = () => {
    setMatchState(MatchState.MatchingCancel);
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
