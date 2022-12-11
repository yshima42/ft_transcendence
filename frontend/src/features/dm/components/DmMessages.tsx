import React from 'react';
import * as C from '@chakra-ui/react';
import { Message } from 'components/molecules/Message';
import { ResponseDm } from '../types';

type Props = {
  messages: ResponseDm[];
};

export const DmMessages: React.FC<Props> = React.memo((props) => {
  const { messages } = props;
  const scrollBottomRef = React.useRef<HTMLDivElement>(null);

  // 更新時の自動スクロール
  React.useEffect(() => {
    scrollBottomRef.current?.scrollIntoView();
  }, [messages]);

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
