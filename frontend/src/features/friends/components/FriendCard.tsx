import { memo, FC } from 'react';
import { Box, Button, Image, Stack, Text } from '@chakra-ui/react';

type Props = {
  id?: string;
  avatarUrl: string;
  name: string;
  button: string;
  onClick: () => void;
};

export const FriendCard: FC<Props> = memo((props) => {
  const { avatarUrl, name, button, onClick } = props;

  return (
    <Box
      w="150px"
      h="200px"
      bg="white"
      borderRadius="10px"
      shadow="md"
      p={4}
      _hover={{ cursor: 'pointer', opacity: 0.8 }}
    >
      <Stack textAlign="center">
        <Image
          borderRadius="full"
          boxSize="70px"
          src={avatarUrl}
          alt={name}
          m="auto"
        />
        <Text fontSize="lg" fontWeight="bold">
          {name}
        </Text>
        <Button onClick={() => onClick()}>{button}</Button>
      </Stack>
    </Box>
  );
});
