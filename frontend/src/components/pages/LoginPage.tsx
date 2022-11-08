import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/providers/useAuthProvider';

export const LoginPage: FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  // 修正方法わからないため一旦eslint回避
  // ここの'/user-list'はチュートリアルでは'/'だったけど'/user-list'にすると想定通りの動きになった
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const to = '/user-list';

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;

    auth.signin(username, () => {
      navigate(to as string, { replace: true });
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Username: <input name="username" type="text" />
        </label>{' '}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
