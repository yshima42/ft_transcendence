import { memo, FC, ChangeEvent, useState } from 'react';
import {
  Box,
  Flex,
  HStack,
  Input,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import { PrimaryButton } from 'components/atoms/button/PrimaryButton';

type Props = {
  name: string;
  nickname: string;
};

export const ProfileCard: FC<Props> = memo((props) => {
  const { name, nickname } = props;

  const [editNickname, setEditNickname] = useState(nickname);

  const onChangeNickname = (e: ChangeEvent<HTMLInputElement>) =>
    setEditNickname(e.target.value);

  const onClickChangeNickname = () => alert('change nickname');

  return (
    <Box as={'dl'} bg="gray.100" borderRadius="md" w={500} p={8}>
      <Stack>
        <Flex>
          <Text w={100} as={'dt'} fontSize="lg" fontWeight="bold">
            Intra Name
          </Text>
          <Text as={'dd'} pl={4} align="center">
            {name}
          </Text>
        </Flex>
        <Flex>
          <HStack>
            <Text w={100} as={'dt'} fontSize="lg" fontWeight="bold">
              Nickname
            </Text>
            <Spacer />
            <Input
              placeholder={nickname}
              value={editNickname}
              onChange={onChangeNickname}
            />
            <Spacer />
            <PrimaryButton onClick={onClickChangeNickname}>edit</PrimaryButton>
          </HStack>
        </Flex>
      </Stack>
    </Box>
  );
});
