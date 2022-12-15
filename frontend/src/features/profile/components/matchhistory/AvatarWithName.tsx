import { memo, FC } from 'react';
import { Box, Text, VStack } from '@chakra-ui/react';
import { UserAvatarContainer } from 'components/molecules/avatar/UserAvatarContainer';

type Props = {
  name: string;
  avatarImageUrl: string;
  id: string;
};

export const AvatarWithName: FC<Props> = memo((props) => {
  const { name, avatarImageUrl, id } = props;

  return (
    <Box h="90" p={2}>
      <VStack>
        <UserAvatarContainer size="md" id={id} src={avatarImageUrl} />

        {/* TODO:ニックネームが長くなるときどう表示するか考える。暫定で省略している */}
        <Text maxWidth={20} noOfLines={1}>
          {name}
        </Text>
      </VStack>
    </Box>
  );
});
