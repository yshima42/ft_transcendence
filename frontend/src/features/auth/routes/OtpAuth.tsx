import { memo, FC, ChangeEvent, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Input,
} from '@chakra-ui/react';
import { API_URL } from 'config';

export const OtpAuth: FC = memo(() => {
  const [token, setToken] = useState('');

  const onChangeToken = (e: ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  };

  return (
    <Flex align="center" justify="center" height="100vh">
      <Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          TransPong
        </Heading>
        <Divider />
        <HStack>
          <Input
            m={4}
            placeholder="Token"
            value={token}
            onChange={onChangeToken}
          />
          <Button
            bg="teal.300"
            color="white"
            as="a"
            href={`${API_URL}/auth/otp/validation?one-time-password=${token}`}
          >
            submit
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
});
