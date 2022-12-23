import { ChangeEvent, FC, memo, SyntheticEvent, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  Heading,
  HStack,
  Input,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { AvatarFormData, useAvatarUpload } from 'hooks/api';
import { useProfile } from 'hooks/api/profile/useProfile';
import {
  ProfileFormData,
  useProfileEdit,
} from 'hooks/api/profile/useProfileEdit';
import { useNavigate } from 'react-router-dom';

export const SignUp: FC = memo(() => {
  const { user } = useProfile();
  const navigate = useNavigate();
  const { editProfile, isLoading: isLoading1 } = useProfileEdit();
  const { uploadAvatar, isLoading: isLoading2 } = useAvatarUpload();
  const [profileFormData, setProfileFormData] = useState<ProfileFormData>();
  const [avatarFormData, setAvatarFormData] = useState<AvatarFormData>();

  const onSubmitSave = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (profileFormData !== undefined) {
      await editProfile(profileFormData);
    }
    if (avatarFormData !== undefined) {
      await uploadAvatar(avatarFormData);
    }
    navigate('/app');
  };

  const onProfileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfileFormData((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const onClickFileSelect = () => {
    inputRef.current?.click();
  };
  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files === null || files[0] === undefined) {
      setAvatarFormData(undefined);
    } else {
      setAvatarFormData({ file: files[0] });
    }
  };

  return (
    <Flex align="center" justify="center" height="100vh">
      <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
        <form onSubmit={onSubmitSave}>
          <Heading as="h1" size="lg" textAlign="center">
            Sign up
          </Heading>
          <Divider />

          <Box m={4}>
            <HStack justify="center" align="center">
              <Avatar
                size="2xl"
                name={user.nickname}
                src={user.avatarImageUrl}
              />
              <input
                hidden
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={onChangeFile}
              />
              <Box pl={8}>
                <VStack justify="center" align="center">
                  <Text>
                    {avatarFormData?.file.name ?? '選択されていません'}
                  </Text>
                  <Spacer />
                  <Button onClick={onClickFileSelect}>ファイル選択</Button>
                  {/* デフォルトのファイル選択 */}
                  {/* <Input type="file" accept="image/*" onChange={onFileInputChange} /> */}
                </VStack>
              </Box>
            </HStack>
          </Box>

          <Box my={4} px={4}>
            <HStack justify="start" align="center">
              <Text w={100} as={'dt'} fontSize="lg">
                Name
              </Text>
              <Text w={100} as={'dd'}>
                {user.name}
              </Text>
            </HStack>
          </Box>

          <Box my={4} px={4}>
            <HStack justify="start" align="center">
              <FormLabel htmlFor="nickname" fontSize="lg">
                Nickname
              </FormLabel>
              <Input
                id="nickname"
                name="nickname"
                // 参考サイト調べるとvalueの記述あるけど、なぜ必要かわからない。
                // value={profileFormData?.nickname}
                onChange={onProfileChange}
              />
            </HStack>
          </Box>

          <Flex justify="right" align="center">
            <Button type="submit" isLoading={isLoading1 && isLoading2}>
              Save
            </Button>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
});
