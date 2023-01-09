import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login } from './Login';
import { OtpAuth } from './OtpAuth';
import { Page404 } from './Page404';
import { SignUp } from './SignUp';
import { UnexpectedError } from './UnexpectedError';

export const AuthRoutes: FC = () => {
  return (
    <Routes>
      <Route path="" element={<Login />} />
      <Route path="sign-up" element={<SignUp />} />
      <Route path="otp" element={<OtpAuth />} />
      <Route path="error" element={<UnexpectedError />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};
