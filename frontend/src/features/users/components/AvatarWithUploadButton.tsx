import { memo, FC, useRef } from 'react';
import { Image, Stack } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { AxiosError } from 'axios';
import { PrimaryButton } from 'components/button/PrimaryButton';
import { axios } from '../../../lib/axios';

type Props = {
  name: string;
  avatarUrl: string;
};

export const AvatarWithUploadButton: FC<Props> = memo((props) => {
  const { name, avatarUrl } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const onClickUpload = () => {
    console.log(inputRef.current);
    inputRef.current?.click();
  };

  const onFileInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.currentTarget.files === null) {
      return;
    }
    console.log(event.currentTarget.files[0]);

    const file = event.currentTarget.files[0];

    if (file === null) {
      return;
    }

    let id = '';
    await axios.get<User>('/users/me').then((res) => {
      id = res.data.id;
    });

    const formData = new FormData();
    formData.append('file', file);

    await axios
      .post(`/users/${id}/avatar`, formData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((e: AxiosError) => {
        console.error(e);
      });
  };

  return (
    <Stack align="center" w={100} m={4}>
      <Image
        borderRadius="full"
        boxSize="100px"
        src={avatarUrl}
        alt={name}
        m={4}
      />
      <PrimaryButton onClick={onClickUpload}>UPLOAD</PrimaryButton>
      <input
        hidden
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFileInputChange}
      />
    </Stack>
  );
});
