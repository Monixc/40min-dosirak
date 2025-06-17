import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";

const Bg = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: #f5f5e6; /* 아이보리 */
  z-index: 0;
`;

const CenterWrap = styled.div`
  position: relative;
  z-index: 1;
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: stretch;
`;

const MobileContainer = styled.div`
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  background: #1a1a1a;
  color: #fff;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.15);
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
  padding-top: 60px; /* 헤더 높이 */
  box-sizing: border-box;
  overflow-x: hidden;
`;

const MainLayout = () => (
  <>
    <Bg />
    <CenterWrap>
      <MobileContainer>
        <Header />
        <Main>
          <Outlet />
        </Main>
        <Footer />
      </MobileContainer>
    </CenterWrap>
  </>
);

export default MainLayout;
