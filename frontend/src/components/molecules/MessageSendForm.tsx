import * as React from 'react';
import * as C from '@chakra-ui/react';
import { HStack } from '@chakra-ui/react';
import * as SocketIOClient from 'socket.io-client';

type Props = {
  roomId: string;
  socket: SocketIOClient.Socket;
};

export const MessageSendForm: React.FC<Props> = ({ roomId, socket }) => {
  const [content, setContent] = React.useState('');
  function sendMessage(content: string): void {
    socket.emit('send_message', {
      roomId,
      content,
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(content);
        setContent('');
      }}
    >
      <HStack>
        <C.Input
          type="text"
          name="content"
          placeholder="message"
          size="md"
          isRequired
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={255}
          minLength={1}
          data-test="message-form"
        />
        <C.Button type="submit" data-test="send-button">
          Send
        </C.Button>
      </HStack>
    </form>
  );
};
