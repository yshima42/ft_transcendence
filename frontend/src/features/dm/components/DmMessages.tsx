import React from 'react';
import * as C from '@chakra-ui/react';
import { Message } from 'components/molecules/Message';
import { ResponseDm } from '../types';

type Props = {
  messages: ResponseDm[];
  scrollBottomRef: React.RefObject<HTMLDivElement>;
};

export const DmMessages: React.FC<Props> = React.memo((props) => {
  const { messages, scrollBottomRef } = props;

  return (
    <C.Flex
      flexDir="column"
      alignItems="flex-start"
      padding={4}
      overflowY="auto"
      overflowX="hidden"
      height="70vh"
    >
      {messages.map((message) => (
        <Message
          key={message.id}
          id={message.id}
          content={message.content}
          createdAt={message.createdAt}
          name={message.sender.name}
          avatarImageUrl={message.sender.avatarImageUrl}
        />
      ))}
      <div ref={scrollBottomRef} />
    </C.Flex>
  );
});
