import { memo, FC } from 'react';
import { SunIcon } from '@chakra-ui/icons';
import {
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import { Stats } from '../hooks/useStats';

// const colorScaleRYG = (rate: number) => {
//   if (rate < 50) {
//     const g = ('00' + Math.round(5.1 * rate).toString(16)).slice(-2);

//     return `#ff${g}00`;
//   } else {
//     const r = ('00' + Math.round(510 - 5.1 * rate).toString(16)).slice(-2);

//     return `#${r}ff00`;
//   }
// };

type Props = {
  stats: Stats;
};

export const StatsCard: FC<Props> = memo((props) => {
  const { stats } = props;
  const { winNum, loseNum } = stats;

  const winRate = Math.floor((winNum / (winNum + loseNum)) * 100);

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
        <Heading size="md">
          {/* トロフィーにしたい */}
          Stats
        </Heading>
      </Flex>
      <Flex justify="center" align="center" pt="4">
        <CircularProgress
          value={winRate}
          // 彩度調節したい
          // color={colorScaleRYG(winRate)}
          size="200px"
        >
          <CircularProgressLabel>
            <Text fontSize="2xl" fontWeight="bold">{`${winRate}%`}</Text>
            <Text fontSize="sm">{`${winNum}/${winNum + loseNum}`}</Text>
          </CircularProgressLabel>
        </CircularProgress>
      </Flex>
    </Flex>
  );
});
