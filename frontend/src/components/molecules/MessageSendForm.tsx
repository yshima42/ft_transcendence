import * as React from 'react';
import * as C from '@chakra-ui/react';

type Props = {
  onSubmit: (content: string) => void;
};

export const MessageSendForm: React.FC<Props> = ({ onSubmit }) => {
  const [content, setContent] = React.useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(content);
        setContent('');
      }}
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
      <C.Button type="submit">Send</C.Button>
    </form>
  );
};
