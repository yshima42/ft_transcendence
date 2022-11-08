import { FC, memo } from 'react';
import { useAuth } from 'hooks/providers/useAuthProvider';
import { useNavigate } from 'react-router-dom';

export const AuthStatus: FC = memo(() => {
  const auth = useAuth();
  const navigate = useNavigate();

  if (auth.user === '') {
    return <p>You are not logged in.</p>;
  }

  return (
    <p>
      Hello {auth.user}!{' '}
      <button
        onClick={() => {
          auth.signout(() => navigate('/'));
        }}
      >
        Sign out
      </button>
    </p>
  );
});
