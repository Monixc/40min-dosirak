import styled from "styled-components";

const GridBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  height: 320px;
  margin-top: 32px;
`;

export const LeftBox = styled(GridBox)`
  background: #fff;
  border-radius: 12px;
  height: 100%;
  cursor: pointer;
  transition: transform 0.2s;
  color: #1a1a1a;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const CondimentBox = styled(GridBox)`
  background: #ffd700;
  border-radius: 12px;
  height: calc(50% - 8px);
  cursor: pointer;
  transition: transform 0.2s;
  color: #2a2a2a;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const IngredientBox = styled(GridBox)`
  background: #4caf50;
  border-radius: 12px;
  height: calc(50% - 8px);
  cursor: pointer;
  transition: transform 0.2s;
  color: #2a2a2a;

  &:hover {
    transform: translateY(-2px);
  }
`;
