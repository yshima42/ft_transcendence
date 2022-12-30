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

import { useOtpAuthValidate } from 'hooks/api/auth/useOtpAuthValidate';
import { useNavigate } from 'react-router-dom';

export const OtpAuth: FC = memo(() => {
  const navigate = useNavigate();
  const { validateOtpAuth, isLoading } = useOtpAuthValidate();
  const [token, setToken] = useState('');

  const onChangeToken = (e: ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  };

  const onClickSubmit = async () => {
    await validateOtpAuth({ oneTimePassword: token });
    navigate('/app');
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
            onClick={onClickSubmit}
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            submit
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
});
