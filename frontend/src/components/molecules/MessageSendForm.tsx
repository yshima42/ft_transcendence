import * as React from 'react';
import * as C from '@chakra-ui/react';

type Props = {
  sendMessage: (content: string) => void;
};

export const MessageSendForm: React.FC<Props> = ({ sendMessage }) => {
  const [content, setContent] = React.useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(content);
        setContent('');
      }}
      data-test="message-form"
    >
      <C.Input
        type="text"
        name="content"
        placeholder="message"
        size="lg"
        isRequired
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={255}
        minLength={1}
      />
      <C.Button type="submit" data-test="send-button">
        Send
      </C.Button>
    </form>
  );
};
