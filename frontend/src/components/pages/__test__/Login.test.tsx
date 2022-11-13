import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../../../features/auth/routes/Login';

describe('Test Login Component', () => {
  it('renders 42auth in page', () => {
    render(<Login />, { wrapper: BrowserRouter });
    // screen.debug();
    expect(screen.getByText('42ユーザー認証')).toBeInTheDocument();
  });
  it('renders 4 buttons', async () => {
    render(<Login />, { wrapper: BrowserRouter });
    // screen.debug();
    const buttonList = await screen.findAllByRole('button');
    expect(buttonList).toHaveLength(4);
  });
});
