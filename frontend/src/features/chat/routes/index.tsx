import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Page404 } from 'features/auth/routes/Page404';
import { ChatRoomPage } from './ChatRoom/ChatRoomPage';
import { ChatRoomSettingsPage } from './ChatRoom/ChatRoomSettingsPage';
import { ChatRoomConfirmation } from './ChatRoomConfirmationPage';
import { ChatRoomsMePage } from './ChatRoomsMePage';
import { ChatRoomsPage } from './ChatRoomsPage';
import { CreateChatRoomsPage } from './CreateChatRoomsPage';

export const ChatRoutes: FC = () => {
  return (
    <Routes>
      <Route path="rooms" element={<ChatRoomsPage />} />
      <Route path="rooms/me" element={<ChatRoomsMePage />} />
      <Route path="rooms/create" element={<CreateChatRoomsPage />} />
      <Route path="rooms/:chatRoomId" element={<ChatRoomPage />} />
      <Route
        path="rooms/:chatRoomId/settings"
        element={<ChatRoomSettingsPage />}
      />
      <Route
        path="rooms/:chatRoomId/confirmation"
        element={<ChatRoomConfirmation />}
      />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};
