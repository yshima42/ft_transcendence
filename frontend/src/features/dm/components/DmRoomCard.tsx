import React from 'react';
import * as C from '@chakra-ui/react';
import { User } from '@prisma/client';

type Props = {
  dmRoomMember: Partial<User>;
  lastModified: Date;
};

export const DmRoomCard: React.FC<Props> = React.memo((props) => {
  const { dmRoomMember, lastModified } = props;

  return (
    <C.Box p={5} shadow="md" borderWidth="1px">
      <C.Flex>
        <C.Box>
          <C.Text fontSize="sm">{lastModified.toLocaleString()}</C.Text>
          <C.Heading fontSize="xl">{dmRoomMember.name}</C.Heading>
          <C.Avatar
            size="md"
            name={dmRoomMember.name}
            src={dmRoomMember.avatarImageUrl}
          />
        </C.Box>
      </C.Flex>
    </C.Box>
  );
});
