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
import { InviteState } from '../hooks/useGameInviting';

type Props = {
  setInviteState: React.Dispatch<React.SetStateAction<InviteState>>;
  setBallSpeed: React.Dispatch<React.SetStateAction<number>>;
};

export const GamePreference: FC<Props> = memo((props) => {
  const { setInviteState, setBallSpeed } = props;

  const [value, setValue] = useState('2');

  const onClickPreferenceOk = () => {
    switch (value) {
      case '1':
        setBallSpeed(5);
        break;
      case '2':
        setBallSpeed(8);
        break;
      case '3':
        setBallSpeed(12);
        break;
    }
    setInviteState(InviteState.Inviting);
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
              <Radio value="1">Slow</Radio>
              <Radio value="2">Normal</Radio>
              <Radio value="3">Fast</Radio>
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
