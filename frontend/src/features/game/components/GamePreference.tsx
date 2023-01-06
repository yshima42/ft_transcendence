import { memo, FC, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';

enum BallSpeed {
  SLOW = 'SLOW',
  NORMAL = 'NORMAL',
  FAST = 'FAST',
}

type Props = {
  setNextInviteState: () => void;
  setBallSpeed: React.Dispatch<React.SetStateAction<number>>;
};

export const GamePreference: FC<Props> = memo((props) => {
  const { setNextInviteState, setBallSpeed } = props;

  const [value, setValue] = useState<string>(BallSpeed.NORMAL);

  const onClickPreferenceOk = () => {
    switch (value) {
      case BallSpeed.SLOW:
        setBallSpeed(4);
        break;
      case BallSpeed.NORMAL:
        setBallSpeed(5);
        break;
      case BallSpeed.FAST:
        setBallSpeed(7);
        break;
    }
    setNextInviteState();
  };

  return (
    <Flex align="center" justify="center" height="40vh">
      <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          Game Preference
        </Heading>
        <Divider />
        <Heading as="h2" size="md" textAlign="center">
          Ball Speed
        </Heading>
        <Center>
          <RadioGroup onChange={setValue} value={value}>
            <Stack direction="row">
              <Radio value={BallSpeed.SLOW}>Slow</Radio>
              <Radio value={BallSpeed.NORMAL}>Normal</Radio>
              <Radio value={BallSpeed.FAST}>Fast</Radio>
            </Stack>
          </RadioGroup>
        </Center>
        <Stack spacing={4} py={4} px={10} align="center">
          <Button onClick={onClickPreferenceOk}>OK</Button>
        </Stack>
      </Box>
    </Flex>
  );
});
