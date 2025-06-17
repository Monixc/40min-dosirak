import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import Header from "./Header";

const LayoutWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #1a1a1a;
  overflow-x: hidden;
  position: relative;
  margin: 0;
  padding: 0;

  @media (min-width: 481px) {
    background: #f5f5e6;
  }
`;

const MobileContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #1a1a1a;
  color: #fff;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (min-width: 481px) {
    max-width: 480px;
    margin: 0 auto;
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.15);
  }
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
  padding-top: 60px;
  box-sizing: border-box;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.div`
  flex: 1;
`;

const Footer = styled.footer`
  width: 100%;
  height: 60px;
  background: #242424;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

const MainLayout = () => {
  const location = useLocation();
  const showFooter = location.pathname === "/";

  return (
    <LayoutWrapper>
      <MobileContainer>
        <Header />
        <Main>
          <ContentArea>
            <Outlet />
          </ContentArea>
          {showFooter && <Footer>©킁킁잉</Footer>}
        </Main>
      </MobileContainer>
    </LayoutWrapper>
  );
};

export default MainLayout;
