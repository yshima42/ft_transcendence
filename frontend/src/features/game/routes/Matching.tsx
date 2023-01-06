import { memo, FC } from 'react';
import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import { PrimaryButton } from 'components/atoms/button/PrimaryButton';
import { CenterSpinner } from 'components/atoms/spinner/CenterSpinner';
import { ContentLayout } from 'components/ecosystems/ContentLayout';
import { MatchState, useGameMatching } from '../hooks/useGameMatching';

export const Matching: FC = memo(() => {
  const { matchState, setMatchState } = useGameMatching();

  const onClickCancel = () => {
    setMatchState(MatchState.MatchingCancel);
  };

  return matchState === MatchState.SocketConnecting ? (
    <CenterSpinner h="40vh" />
  ) : (
    <ContentLayout title="">
      <Center>
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
      </Center>
    </ContentLayout>
  );
});
