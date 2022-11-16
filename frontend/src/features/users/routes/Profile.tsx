import React, { memo, FC, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { User } from '@prisma/client';
import { AxiosError } from 'axios';
import { ContentLayout } from 'components/templates/ContentLayout';
import { axios } from '../../../lib/axios';
import { AvatarWithUploadButton } from '../components/AvatarWithUploadButton';
import { ProfileCard } from '../components/ProfileCard';

export const Profile: FC = memo(() => {
  const [file, setFile] = useState<File | null>(null);

  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0] != null) {
      setFile(files[0]);
    }

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

  const onClickSubmit = async () => {
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
    <ContentLayout title="Profile">
      <Flex justify="center" padding={{ base: 5, md: 7 }}>
        <AvatarWithUploadButton
          name="marvin"
          avatarUrl="https://source.unsplash.com/random"
        />
        <ProfileCard name="yuuyuu" nickname="hakusho" />
      </Flex>

      <div className="App">
        <div className="App-form">
          <input
            name="file"
            type="file"
            accept="image/*"
            onChange={onChangeFile}
          />

          <input
            type="button"
            disabled={file == null}
            value="送信"
            onClick={onClickSubmit}
          />
        </div>
      </div>
    </ContentLayout>
  );
});
