import styled from "styled-components";
import type { Recipe } from "../../../types";
import { useNavigate } from "react-router-dom";

const SquareCardWrapper = styled.div`
  width: 100%;
  max-width: 220px;
  min-width: 0;
  aspect-ratio: 1 / 1;
  background: #232323;
  border-radius: 16px;
  padding: 16px;
  color: #fff;
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  cursor: pointer;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16);
  }
`;

const Title = styled.h3`
  font-size: 18px;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DateText = styled.div`
  color: #888;
  font-size: 13px;
  margin-bottom: 10px;
`;

const InputText = styled.div`
  color: #bbb;
  font-size: 14px;
  margin-bottom: 8px;
  white-space: pre-line;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1 1 auto;
`;

const Ingredients = styled.div`
  color: #a5a5a5;
  font-size: 13px;
  margin-top: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface SquareCardProps {
  recipe: Recipe;
}

export const SquareCard = ({ recipe }: SquareCardProps) => {
  const navigate = useNavigate();
  const dateOnly = recipe.createdAt.split(" ")[0];

  const handleClick = () => {
    navigate("/recipe-detail", { state: recipe });
  };

  return (
    <SquareCardWrapper onClick={handleClick} style={{ position: "relative" }}>
      <div>
        <Title title={recipe.title}>{recipe.title}</Title>
        <DateText>{dateOnly}</DateText>
        <InputText title={recipe.input}>{recipe.input}</InputText>
      </div>
      <Ingredients>{recipe.ingredients}</Ingredients>
    </SquareCardWrapper>
  );
};
