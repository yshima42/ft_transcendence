import { ChangeEvent, FC, memo, SyntheticEvent, useRef, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Box,
  HStack,
  Avatar,
  Spacer,
  VStack,
  Text,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import {
  AvatarFormData,
  ProfileFormData,
  useAvatarUpload,
  useProfile,
  useProfileEdit,
} from 'hooks/api';

export const ModalProfileEdit: FC = memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user } = useProfile();
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
    <>
      <Button size="sm" onClick={onOpen}>
        Edit
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Profile Edit</ModalHeader>
          <ModalCloseButton />

          <form onSubmit={onSubmitSave}>
            <ModalBody>
              <Box mb={2}>
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
            </ModalBody>

            <ModalFooter>
              <Button type="submit" isLoading={isLoading1 && isLoading2}>
                Save
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
});
