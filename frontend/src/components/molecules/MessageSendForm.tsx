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
        name="content"
        placeholder="メッセージを入力してください"
        size="lg"
        isRequired
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <C.Button type="submit">送信</C.Button>
    </form>
  );
};
