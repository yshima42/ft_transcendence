import { memo, FC, ChangeEvent, useState } from 'react';
import {
  Box,
  Flex,
  HStack,
  Image,
  Input,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import { PrimaryButton } from 'components/atoms/button/PrimaryButton';

export const Profile: FC = memo(() => {
  const mockUser = {
    name: 'rmiyagi',
    nickname: 'ryochin',
  };

  const [nickname, setNickname] = useState(mockUser.nickname);

  const onClickChangeAvatar = () => alert('change avatar');

  const onChangeNickname = (e: ChangeEvent<HTMLInputElement>) =>
    setNickname(e.target.value);

  const onClickChangeNickname = () => alert('change nickname');

  return (
    <>
      <Flex justify="center" padding={{ base: 5, md: 7 }}>
        <Stack align="center" w={100} m={4}>
          <Image
            borderRadius="full"
            boxSize="100px"
            src="https://source.unsplash.com/random"
            alt={mockUser.name}
            m={4}
          />
          <PrimaryButton onClick={onClickChangeAvatar}>UPLOAD</PrimaryButton>
        </Stack>
        <Box as={'dl'} bg="gray.100" borderRadius="md" w={500} p={8}>
          <Stack>
            <Flex>
              <Text w={100} as={'dt'} fontSize="lg" fontWeight="bold">
                Intra Name
              </Text>
              <Text as={'dd'} pl={4} align="center">
                {mockUser.name}
              </Text>
            </Flex>
            <Flex>
              <HStack>
                <Text w={100} as={'dt'} fontSize="lg" fontWeight="bold">
                  Nickname
                </Text>
                <Spacer />
                <Input
                  placeholder={mockUser.nickname}
                  value={nickname}
                  onChange={onChangeNickname}
                />
                <Spacer />
                <PrimaryButton onClick={onClickChangeNickname}>
                  edit
                </PrimaryButton>
              </HStack>
            </Flex>
          </Stack>
        </Box>
      </Flex>
    </>
  );
});
