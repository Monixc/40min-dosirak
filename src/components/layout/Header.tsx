import { useState, useEffect } from "react";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import { APIKeyModal } from "../common/Modal";
import logo from "../../assets/logo.png";

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: #242424;
  display: flex;
  align-items: center;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  @media (min-width: 481px) {
    max-width: 480px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
`;

const Logo = styled.img`
  width: 32px;
  height: 32px;
`;

const Title = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
`;

const RightSection = styled.div`
  margin-left: auto;
  margin-right: 1rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  &:hover {
    color: #ff6b6b;
  }
`;

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAPIKeySubmit = (apiKey: string, shouldSave: boolean) => {
    // storage 저장은 모달 컴포넌트에서 처리
    setIsModalOpen(false);
  };

  // 컴포넌트 마운트 시 API 키 체크
  useEffect(() => {
    const savedKey =
      localStorage.getItem("gpt_api_key") ||
      sessionStorage.getItem("gpt_api_key");
    if (!savedKey) {
      setIsModalOpen(true);
    }
  }, []);

  return (
    <>
      <HeaderContainer>
        <LeftSection>
          <Logo src={logo} alt="도시락 로고" />
          <Title>Dosirak</Title>
        </LeftSection>
        <RightSection>
          <IconButton onClick={() => setIsModalOpen(true)}>
            <Icon icon="mdi:key" width="24" height="24" />
          </IconButton>
        </RightSection>
      </HeaderContainer>
      <APIKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAPIKeySubmit}
      />
    </>
  );
};

export default Header;
