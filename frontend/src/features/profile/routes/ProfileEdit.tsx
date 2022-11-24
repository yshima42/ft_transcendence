import { ChangeEvent, FC, memo, useRef } from 'react';
import {
  Avatar,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { AvatarFormBody, ProfileFormBody } from '../hooks/useSave';

export const ProfileEdit: FC = memo(() => {
  const { user } = useProfile();
  const navigate = useNavigate();

  let profileFormBody: ProfileFormBody;
  let avatarFormBody: AvatarFormBody;

  const onClickSave = () => {
    console.log(profileFormBody, avatarFormBody);
    // lint error のため、コメントアウト
    // const data = useSaveProfile(profileFormBody, avatarFormBody);
    // console.log(data);
    navigate('/app/profile');
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const onClickUpload = () => {
    console.log(inputRef.current);
    inputRef.current?.click();
  };

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files === null) {
      return;
    }
    console.log(event.currentTarget.files[0]);
    const file = event.currentTarget.files[0];
    if (file === null) {
      return;
    }
    avatarFormBody.file = file;
  };

  const onChangeNickname = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    profileFormBody.nickname = e.target.value;
  };

  return (
    <Flex direction="column" bg="gray" w="100%" align="center">
      <Flex>
        <Avatar size="2xl" name={user.nickname} src={user.avatarUrl} />
        <Button onClick={onClickUpload}>UPLOAD</Button>
        <input
          hidden
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFileInputChange}
        />
      </Flex>
      <Flex>
        <Text w={100} as={'dt'} fontSize="lg" fontWeight="bold">
          Intra Name
        </Text>
        <Text as={'dd'} pl={4} align="center">
          {user.name}
        </Text>
      </Flex>
      <Flex>
        <Text w={100} as={'dt'} fontSize="lg" fontWeight="bold">
          Nickname
        </Text>
        <Text as={'dd'} pl={4} align="center">
          {user.nickname}
        </Text>
        <Input
          placeholder={'new nickname'}
          // value={nickname}
          onChange={onChangeNickname}
        />
        {/* <Button onClick={onClickChangeNickname}>edit</Button> */}
      </Flex>
      <Flex>
        <FormControl display="flex">
          <FormLabel>TwoFactor</FormLabel>
          <Switch id="TwoFactor" />
        </FormControl>
      </Flex>
      <Button onClick={onClickSave}>Save</Button>
    </Flex>
  );
});
