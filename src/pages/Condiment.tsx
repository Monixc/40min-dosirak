import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const STORAGE_KEY = "my_condiments";

interface Item {
  id: number;
  name: string;
  checked: boolean;
}

const PageContainer = styled.div`
  padding: 16px;
  max-width: 480px;
  margin: 0 auto;
  padding-bottom: 120px;
`;

const Title = styled.h2`
  font-size: 22px;
  color: #fff;
  margin-bottom: 16px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #333;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 auto;
`;

const Name = styled.span`
  font-size: 16px;
  color: #fff;
  flex: 1 1 auto;
`;

const CheckLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 16px;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  display: none;
`;

const CustomCheckbox = styled.span<{ checked: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: #000;
  border: none;
  box-sizing: border-box;
  position: relative;
  margin-right: 8px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #999;
  font-size: 16px;
  cursor: pointer;
  margin-left: 8px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonRow = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: 100vw;
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  gap: 12px;
  padding: 16px 16px 24px 16px;
  box-sizing: border-box;
  z-index: 100;
  justify-content: center;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const ActionButton = styled.button`
  flex: 1 1 0;
  padding: 16px 0;
  background: #444;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
`;

const AddInputRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const AddInput = styled.input`
  flex: 1 1 0;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #333;
  background: #1a1a1a;
  color: #fff;
  font-size: 15px;
`;

export default function Condiment() {
  const [items, setItems] = useState<Item[]>(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const handleCheck = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    const name = input.trim();
    if (!name) return;
    setItems((prev) => [...prev, { id: Date.now(), name, checked: false }]);
    setInput("");
  };

  return (
    <PageContainer>
      <Title>🧂보유한 조미료</Title>
      <AddInputRow>
        <AddInput
          placeholder="조미료 이름 입력"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
        />
        <ActionButton
          style={{ flex: "none", padding: "0 16px" }}
          onClick={handleAdd}>
          추가
        </ActionButton>
      </AddInputRow>
      <List>
        {items.map((item) => (
          <ListItem key={item.id}>
            <ItemRow>
              <CheckLabel>
                <HiddenCheckbox
                  checked={item.checked}
                  onChange={() => handleCheck(item.id)}
                />
                <CustomCheckbox checked={item.checked}>
                  {item.checked && (
                    <Icon
                      icon="mdi:check-bold"
                      color="#fff"
                      width="14"
                      height="14"
                    />
                  )}
                </CustomCheckbox>
              </CheckLabel>
              <Name>{item.name}</Name>
            </ItemRow>
            <DeleteButton onClick={() => handleDelete(item.id)} title="삭제">
              <Icon icon="mdi:trash-can-outline" width="16" height="16" />
            </DeleteButton>
          </ListItem>
        ))}
      </List>
      <ButtonRow>
        <ActionButton onClick={() => navigate(-1)}>뒤로가기</ActionButton>
      </ButtonRow>
    </PageContainer>
  );
}
