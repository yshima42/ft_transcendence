import { FC, useState, useEffect, createContext } from 'react';
import { User } from '@prisma/client';
import { axios } from 'lib/axios';
import { AppProvider } from 'providers/AppProvider';
import { AppRoutes } from 'routes/AppRoutes';

// TODO ここのuseContextに関しては一時的なコード。あとで修正する。useQueryのことなど、kameiさんに相談。
const defaultUser: User = {
  id: '',
  name: '',
  nickname: '',
  avatarImageUrl: '',
  isTwoFactorAuthEnabled: false,
  twoFactorAuthSecret: null,
  onlineStatus: 'OFFLINE',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const UserContext = createContext<User>(defaultUser);

const App: FC = () => {
  const [user, setUser] = useState<User>(defaultUser);

  async function getUser(): Promise<void> {
    const user: { data: User } = await axios.get('/users/me/profile');
    setUser(user.data);
  }

  useEffect(() => {
    getUser().catch((err) => console.error(err));
    console.log(`user: ${JSON.stringify(user)}`);
  }, []);

  return (
    <AppProvider>
      <UserContext.Provider value={user}>
        <AppRoutes />
      </UserContext.Provider>
    </AppProvider>
  );
};

export default App;
