import { memo, FC } from 'react';
import { Image, Stack } from '@chakra-ui/react';
import { PrimaryButton } from 'components/atoms/button/PrimaryButton';

type Props = {
  name: string;
  avatarUrl: string;
};

export const AvatarWithUploadButton: FC<Props> = memo((props) => {
  const { name, avatarUrl } = props;

  const onClickChangeAvatar = () => alert('change avatar');

  return (
    <Stack align="center" w={100} m={4}>
      <Image
        borderRadius="full"
        boxSize="100px"
        src={avatarUrl}
        alt={name}
        m={4}
      />
      <PrimaryButton onClick={onClickChangeAvatar}>UPLOAD</PrimaryButton>
    </Stack>
  );
});
