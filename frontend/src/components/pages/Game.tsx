import { memo, FC } from 'react';
import { useLocation } from 'react-router-dom';

interface State {
  loginUser: string;
  opponent: string;
}

// コンポーネント名はあとで変更する。ゲームの前の待機画面。ユーザー情報を表示させるイメージ
export const Game: FC = memo(() => {
  const location = useLocation();
  const { loginUser, opponent } = location.state as State;

  return (
    <p>
      {loginUser} vs {opponent}
    </p>
  );
});
