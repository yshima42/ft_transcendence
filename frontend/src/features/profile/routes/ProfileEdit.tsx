import { ChangeEvent, FC, memo, SyntheticEvent, useRef, useState } from 'react';
import {
  Avatar,
  Button,
  Flex,
  FormLabel,
  Input,
  Switch,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { AvatarFormData, useSaveAvatar } from '../hooks/useSaveAvatar';
import { ProfileFormData, useSaveProfile } from '../hooks/useSaveProfile';

export const ProfileEdit: FC = memo(() => {
  const { user } = useProfile();
  const navigate = useNavigate();
  const { saveProfile, isLoading: isLoading1 } = useSaveProfile();
  const { saveAvatar, isLoading: isLoading2 } = useSaveAvatar();
  const [profileFormData, setProfileFormData] = useState<ProfileFormData>();
  const [avatarFormData, setAvatarFormData] = useState<AvatarFormData>();

  const onSubmitSave = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (profileFormData !== undefined) {
      await saveProfile(profileFormData);
    }
    if (avatarFormData !== undefined) {
      await saveAvatar(avatarFormData);
    }
    navigate('/app/profile');
  };

  const onProfileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    setProfileFormData((state) => ({
      ...state,
      [name]: name === 'nickname' ? value : checked,
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
        <FormLabel>Two Factor</FormLabel>
        <Switch
          name="twoFactor"
          // isChecked={profileFormData?.twoFactor}
          onChange={onProfileChange}
        />
        <Button type="submit" isLoading={isLoading1 && isLoading2}>
          Save
        </Button>
      </form>
    </Flex>
  );
});
