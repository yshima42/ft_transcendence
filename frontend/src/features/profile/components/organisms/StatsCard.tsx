import { memo, FC } from 'react';
import { SunIcon } from '@chakra-ui/icons';
import {
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import { useGameStats } from 'hooks/api/game/useGameStats';

// const colorScaleRYG = (rate: number) => {
//   if (rate < 50) {
//     const g = ('00' + Math.round(5.1 * rate).toString(16)).slice(-2);

//     return `#ff${g}00`;
//   } else {
//     const r = ('00' + Math.round(510 - 5.1 * rate).toString(16)).slice(-2);

//     return `#${r}ff00`;
//   }
// };

type StatsCardProps = {
  id: string;
};

export const StatsCard: FC<StatsCardProps> = memo(({ id }: StatsCardProps) => {
  const { gameStats } = useGameStats(id);

  return (
    <Flex
      w="100%"
      h="100%"
      bg="gray.200"
      borderRadius="20px"
      shadow="md"
      p={3}
      pt={5}
      direction="column"
    >
      <Flex>
        <SunIcon w="6" h="6" pr="2" />
        <Heading size="md">Stats</Heading>
      </Flex>
      <Flex justify="center" align="center" pt="4">
        <CircularProgress
          value={gameStats.winRate}
          size="200px"
          color="teal.300"
        >
          <CircularProgressLabel>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              data-test={'profile-win-rate'}
            >{`${gameStats.winRate}%`}</Text>
            <Text
              fontSize="sm"
              data-test={'profile-total-matches'}
            >{`${gameStats.totalWins}/${gameStats.totalMatches}`}</Text>
          </CircularProgressLabel>
        </CircularProgress>
      </Flex>
    </Flex>
  );
});
