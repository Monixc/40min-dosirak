import { useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 90%;
  max-width: 400px;
  background: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #fff;
  font-size: 20px;
  margin-bottom: 8px;
`;

const SubTitle = styled.p`
  color: #999;
  font-size: 12px;
  margin-bottom: 20px;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #333;
  background: #1a1a1a;
  color: #fff;
  font-size: 14px;

  &::placeholder {
    color: #666;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background: #2a2a2a;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid #333;

  &:hover {
    background: #333;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ToggleLabel = styled.label`
  color: #fff;
  font-size: 14px;
  cursor: pointer;
`;

const Toggle = styled.input`
  position: relative;
  width: 40px;
  height: 20px;
  appearance: none;
  background: #333;
  border-radius: 20px;
  cursor: pointer;

  &:checked {
    background: #ff6b6b;
  }

  &:before {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    background: #fff;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    transition: 0.3s;
  }

  &:checked:before {
    transform: translateX(20px);
  }
`;

const InfoText = styled.div`
  color: #999;
  font-size: 12px;
  line-height: 1.5;
  margin-top: 16px;
  word-break: keep-all;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    position: relative;
    padding-left: 8px;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }

    &:before {
      content: "•";
      position: absolute;
      left: 0;
    }
  }
`;

interface APIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (apiKey: string, shouldSave: boolean) => void;
}

export const APIKeyModal = ({
  isOpen,
  onClose,
  onSubmit,
}: APIKeyModalProps) => {
  const [apiKey, setApiKey] = useState("");
  const [shouldSave, setShouldSave] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    // API 키를 storage에 저장
    if (shouldSave) {
      localStorage.setItem("gpt_api_key", apiKey);
    } else {
      sessionStorage.setItem("gpt_api_key", apiKey);
    }

    onSubmit(apiKey, shouldSave);
    setApiKey("");
    setShouldSave(false);
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>API 키 설정</Title>
        <SubTitle>ChatGPT API 키를 발급받아 입력하세요</SubTitle>
        <form onSubmit={handleSubmit}>
          <InputWrapper>
            <Input
              type="password"
              placeholder="OpenAI API Key (sk-...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button type="submit">확인</Button>
          </InputWrapper>

          <ToggleContainer>
            <ToggleLabel htmlFor="saveToggle">브라우저에 저장하기</ToggleLabel>
            <Toggle
              id="saveToggle"
              type="checkbox"
              checked={shouldSave}
              onChange={(e) => setShouldSave(e.target.checked)}
            />
          </ToggleContainer>

          <InfoText>
            <ul>
              <li>
                브라우저 저장 시 API 키가 로컬에 저장되어 재입력이 필요 없으나,
                공용 PC에서는 권장하지 않습니다.
              </li>
              <li>
                저장하지 않을 시 매 접속마다 입력이 필요하지만, 더 안전하게
                사용할 수 있습니다.
              </li>
            </ul>
          </InfoText>
        </form>
      </ModalContainer>
    </Overlay>
  );
};
