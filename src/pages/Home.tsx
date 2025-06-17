import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import type { TouchEvent } from "react";
import { RecipeCard, EmptyCard } from "../components/common/Card";
import { Input, Button } from "../components/common/Input";
import {
  GridContainer,
  LeftBox,
  RightColumn,
  CondimentBox,
  IngredientBox,
} from "../components/common/Grid";
import type { Recipe } from "../types";

const Container = styled.div`
  padding: 20px;
`;

// 임시 데이터 (테스트용으로 3개만)
const tempCards: Recipe[] = [
  {
    id: 1,
    title: "김치볶음밥",
    ingredients: "김치, 밥, 참기름",
    createdAt: "2024-03-15 14:30",
  },
  {
    id: 2,
    title: "계란말이",
    ingredients: "계란, 대파, 식용유",
    createdAt: "2024-03-15 15:45",
  },
  {
    id: 3,
    title: "된장찌개",
    ingredients: "된장, 두부, 애호박",
    createdAt: "2024-03-15 16:20",
  },
  {
    id: 4,
    title: "된장찌개",
    ingredients: "된장, 두부, 애호박",
    createdAt: "2024-03-15 16:20",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [currentCard, setCurrentCard] = useState(0);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);
  const [offsetX, setOffsetX] = useState(0);

  const handleTouchStart = (e: TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    touchEnd.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEnd.current = e.touches[0].clientX;
    const diff = touchStart.current - touchEnd.current;
    setOffsetX(-diff);
  };

  const handleTouchEnd = () => {
    const diff = touchStart.current - touchEnd.current;
    const minSwipeDistance = 50; // 최소 스와이프 거리

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0 && currentCard < tempCards.length - 1) {
        // 왼쪽으로 스와이프
        setCurrentCard((prev) => prev + 1);
      } else if (diff < 0 && currentCard > 0) {
        // 오른쪽으로 스와이프
        setCurrentCard((prev) => prev - 1);
      }
    }
    setOffsetX(0);
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <Container>
      <Title>레시피 생성하기</Title>
      <InputWrapper>
        <Input placeholder="재료를 입력하세요" />
        <Button>생성</Button>
      </InputWrapper>

      <SectionTitle>
        <span>🕒</span>
        최근 생성한 레시피
      </SectionTitle>

      <SlideContainer>
        {tempCards.length > 0 ? (
          <RecipeCard
            recipe={tempCards[currentCard]}
            offset={offsetX}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            currentIndex={currentCard}
            totalRecipes={tempCards.length}
          />
        ) : (
          <EmptyCard />
        )}
      </SlideContainer>

      <GridContainer>
        <LeftBox onClick={() => navigate("/recipe")}>레시피</LeftBox>
        <RightColumn>
          <CondimentBox onClick={() => navigate("/condiment")}>
            조미료
          </CondimentBox>
          <IngredientBox onClick={() => navigate("/ingredient")}>
            식재료
          </IngredientBox>
        </RightColumn>
      </GridContainer>
    </Container>
  );
};

export default Home;

const Title = styled.h1`
  text-align: center;
  color: #fff;
  font-size: 24px;
  margin-bottom: 24px;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  color: #fff;
  font-size: 14px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
`;

const SlideContainer = styled.div`
  margin: 0;
  overflow: hidden;
  touch-action: pan-y pinch-zoom;
`;
