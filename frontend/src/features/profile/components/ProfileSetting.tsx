import { memo, FC } from 'react';
import { Button, Flex, Spacer, Tag, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const ProfileSetting: FC = memo(() => {
  const navigate = useNavigate();

  return (
    <>
      <Flex mt="2">
        <Text fontSize="sm">Two-Factor</Text>
        <Tag size="sm" variant="outline" colorScheme="green" ml="2">
          ON
        </Tag>
      </Flex>
      <Spacer />
      <Button size="xs" onClick={() => navigate('/app/profile/edit')}>
        Edit
      </Button>
    </>
  );
});
