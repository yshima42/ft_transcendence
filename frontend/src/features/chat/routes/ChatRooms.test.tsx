import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ChatRooms } from './ChatRooms';

test('「チャットルーム一覧」が描画されている', () => {
  // MemoryRouterを使うことで、URLを指定して描画できる
  // initialEntriesで初期URLを指定できる
  render(
    <MemoryRouter initialEntries={['/app/chat']}>
      <ChatRooms />
    </MemoryRouter>
  );
  expect(screen.getByText('Chat')).toBeInTheDocument();
  expect(screen.getByTestId('create-chat-room')).toBeInTheDocument();
  // chat一覧の先頭からchatRoomIdを取得
  const chatRoomId = screen
    .getAllByTestId('chat-room-id')
    .map((element) => element.textContent)[0];
  console.log(chatRoomId);
});
