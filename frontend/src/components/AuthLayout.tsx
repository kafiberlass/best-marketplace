import type { ReactNode } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import { Panel } from './ui';

export const AuthWrapper = styled.main`
  display: grid;
  place-items: center;
  min-height: calc(100vh - 80px);
  padding: 24px 16px;
`;

export const AuthForm = styled(Panel).attrs({ as: 'form' })`
  width: min(420px, 100%);

  h1 {
    margin: 0 0 22px;
    font-size: 22px;
    text-align: center;
  }
`;

export const AuthLinks = styled.p`
  margin: 4px 0 20px;
  font-size: 14px;
  text-align: center;
`;

export const AuthActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const FieldError = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.danger};
`;

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <AuthWrapper>{children}</AuthWrapper>
    </>
  );
}

export default AuthLayout;
