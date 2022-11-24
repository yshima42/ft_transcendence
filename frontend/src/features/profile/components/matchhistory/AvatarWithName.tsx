import { memo, FC } from 'react';
import { Avatar, Box, Text, VStack } from '@chakra-ui/react';

type Props = {
  name: string;
  avatarUrl: string;
};

export const AvatarWithName: FC<Props> = memo((props) => {
  const { name, avatarUrl } = props;

  return (
    <Box h="90" p={2}>
      <VStack justify="center" align="center">
        <Avatar size="md" src={avatarUrl} name={name} m="auto" />
        <Text fontSize="sm">{name}</Text>
      </VStack>
    </Box>
  );
});
