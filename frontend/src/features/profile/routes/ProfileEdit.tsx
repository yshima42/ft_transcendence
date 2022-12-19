import { ChangeEvent, FC, memo, SyntheticEvent, useRef, useState } from 'react';
import { Avatar, Button, Flex, FormLabel, Input, Text } from '@chakra-ui/react';
import { AvatarFormData, useAvatarUpload } from 'hooks/api';
import { useProfile } from 'hooks/api/profile/useProfile';
import {
  ProfileFormData,
  useProfileEdit,
} from 'hooks/api/profile/useProfileEdit';
import { useNavigate } from 'react-router-dom';
import { OtpAuthSetting } from 'features/profile/components/OtpAuthSetting';

export const ProfileEdit: FC = memo(() => {
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
    navigate('/app/profile');
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
    <Flex direction="column" bg="gray" w="100%" align="center">
      <form onSubmit={onSubmitSave}>
        <Avatar size="2xl" name={user.nickname} src={user.avatarImageUrl} />
        <Button onClick={onClickFileSelect}>ファイル選択</Button>
        <input
          hidden
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onChangeFile}
        />
        <Text>{avatarFormData?.file.name ?? '選択されてません'}</Text>
        {/* デフォルトのファイル選択 */}
        {/* <Input type="file" accept="image/*" onChange={onFileInputChange} /> */}
        <Text w={100} as={'dt'} fontSize="lg">
          Name
        </Text>
        <Text w={100} as={'dt'} fontSize="lg">
          {user.name}
        </Text>
        <FormLabel htmlFor="nickname">Nickname</FormLabel>
        <Input
          id="nickname"
          name="nickname"
          // 参考サイト調べるとvalueの記述あるけど、なぜ必要かわからない。
          // value={profileFormData?.nickname}
          onChange={onProfileChange}
        />

        <Button type="submit" isLoading={isLoading1 && isLoading2}>
          Save
        </Button>
        <br />
        <br />
        <OtpAuthSetting />
      </form>
    </Flex>
  );
});
