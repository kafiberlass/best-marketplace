import type { ReactNode } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';

const Main = styled.main`
  width: min(1200px, 100% - 32px);
  margin: 0 auto;
  padding: 24px 0 48px;
`;

function Page({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <Main>{children}</Main>
    </>
  );
}

export default Page;
