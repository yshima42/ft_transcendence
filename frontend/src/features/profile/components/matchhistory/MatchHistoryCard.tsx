import { memo, FC } from 'react';
import { Box, Stack, Text, VStack } from '@chakra-ui/react';
import { GameResultCard } from './GameResultCard';
import { PrevAndNextButton } from './PrevAndNextButton';

export const MatchHistoryCard: FC = memo(() => {
  return (
    <Box>
      <Stack>
        <Box bg="teal.200" p={2}>
          <Text as="b">Match History</Text>
        </Box>
        <VStack bg="teal.200" justify="center" align="center">
          <GameResultCard
            name="name"
            avatarUrl="https://source.unsplash.com/random"
            point="12-4"
            date="2022/11/24"
            result="win"
          />
          <GameResultCard
            name="name"
            avatarUrl="https://source.unsplash.com/random"
            point="12-4"
            date="2022/11/24"
            result="win"
          />
          <GameResultCard
            name="name"
            avatarUrl="https://source.unsplash.com/random"
            point="12-4"
            date="2022/11/24"
            result="win"
          />
          <GameResultCard
            name="name"
            avatarUrl="https://source.unsplash.com/random"
            point="12-4"
            date="2022/11/24"
            result="win"
          />
          <GameResultCard
            name="name"
            avatarUrl="https://source.unsplash.com/random"
            point="12-4"
            date="2022/11/24"
            result="win"
          />
        </VStack>
        <PrevAndNextButton />
      </Stack>
    </Box>
  );
});
