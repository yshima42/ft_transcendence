import { memo, FC } from 'react';
import { Box, Divider, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { PrimaryButton } from 'components/atoms/button/PrimaryButton';
import { GamePhase } from '../hooks/useGame';

type Props = {
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
  countDownNum: number;
};

export const Confirmation: FC<Props> = memo((props) => {
  const { setGamePhase, countDownNum } = props;

  return (
    <Flex align="center" justify="center" height="40vh">
      <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          Are you ready...?
        </Heading>
        <Text textAlign="center">{countDownNum}</Text>
        <Divider />
        <Stack spacing={4} py={4} px={10} align="center">
          <PrimaryButton onClick={() => setGamePhase(GamePhase.Confirming)}>
            Yes
          </PrimaryButton>
        </Stack>
      </Box>
    </Flex>
  );
});
