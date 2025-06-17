import styled from "styled-components";
import type { Recipe } from "../../../types";

const CardWrapper = styled.div<{ $offset?: number }>`
  position: relative;
  width: 100%;
  height: 120px;
  background: #2a2a2a;
  border-radius: 12px;
  padding: 20px;
  color: #fff;
  border: 1px solid #333;
  display: flex;
  flex-direction: column;
  transform: translateX(${({ $offset = 0 }) => $offset}px);
  transition: transform 0.3s ease;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CardTitle = styled.h3`
  font-size: 20px;
`;

const CardDateTime = styled.div`
  color: #666;
  font-size: 12px;
`;

const CardIngredients = styled.p`
  color: #999;
  margin-bottom: auto;
  font-size: 14px;
`;

const DotContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 20px;
`;

const Dot = styled.div<{ active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ active }) => (active ? "#fff" : "#333")};
  transition: background 0.3s ease;
`;

interface RecipeCardProps {
  recipe: Recipe;
  offset: number;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  currentIndex: number;
  totalRecipes: number;
}

export const RecipeCard = ({
  recipe,
  offset,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  currentIndex,
  totalRecipes,
}: RecipeCardProps) => (
  <CardWrapper
    $offset={offset}
    onTouchStart={onTouchStart}
    onTouchMove={onTouchMove}
    onTouchEnd={onTouchEnd}>
    <CardHeader>
      <CardTitle>{recipe.title}</CardTitle>
      <CardDateTime>{recipe.createdAt}</CardDateTime>
    </CardHeader>
    <CardIngredients>{recipe.ingredients}</CardIngredients>
    {totalRecipes > 1 && (
      <DotContainer>
        {Array.from({ length: totalRecipes }).map((_, index) => (
          <Dot key={index} active={currentIndex === index} />
        ))}
      </DotContainer>
    )}
  </CardWrapper>
);

export const EmptyCard = () => (
  <CardWrapper>
    <CardHeader>
      <CardTitle>레시피가 없습니다</CardTitle>
    </CardHeader>
    <CardIngredients>
      상단 입력창에서 재료를 입력하고 레시피를 생성해보세요!
    </CardIngredients>
  </CardWrapper>
);
