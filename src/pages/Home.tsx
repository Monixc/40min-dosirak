import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, TouchEvent } from "react";

const Container = styled.div`
  padding: 20px;
`;

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

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #333;
  background: #242424;
  color: #fff;
  font-size: 16px;

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

const CardWrapper = styled.div`
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
  transform: translateX(${(props) => props.$offset}px);
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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  height: 320px;
  margin-top: 32px;
`;

const GridBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
`;

const LeftBox = styled(GridBox)`
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

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CondimentBox = styled(GridBox)`
  background: #ffd700;
  border-radius: 12px;
  height: calc(50% - 8px);
  cursor: pointer;
  transition: transform 0.2s;
  color: #1a1a1a;

  &:hover {
    transform: translateY(-2px);
  }
`;

const IngredientBox = styled(GridBox)`
  background: #4caf50;
  border-radius: 12px;
  height: calc(50% - 8px);
  cursor: pointer;
  transition: transform 0.2s;
  color: #1a1a1a;

  &:hover {
    transform: translateY(-2px);
  }
`;

// 타입 정의 추가
interface Recipe {
  id: number;
  title: string;
  ingredients: string;
  createdAt: string;
}

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

  // 카드가 없을 때 보여줄 컴포넌트
  const EmptyCard = () => (
    <CardWrapper>
      <CardHeader>
        <CardTitle>레시피가 없습니다</CardTitle>
      </CardHeader>
      <CardIngredients>
        상단 입력창에서 재료를 입력하고 레시피를 생성해보세요!
      </CardIngredients>
    </CardWrapper>
  );

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
          <CardWrapper
            $offset={offsetX}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}>
            <CardHeader>
              <CardTitle>{tempCards[currentCard].title}</CardTitle>
              <CardDateTime>
                {formatDateTime(tempCards[currentCard].createdAt)}
              </CardDateTime>
            </CardHeader>
            <CardIngredients>
              {tempCards[currentCard].ingredients}
            </CardIngredients>
            {tempCards.length > 1 && (
              <DotContainer>
                {tempCards.map((_, index) => (
                  <Dot key={index} active={currentCard === index} />
                ))}
              </DotContainer>
            )}
          </CardWrapper>
        ) : (
          <EmptyCard />
        )}
      </SlideContainer>
      {/* 
      <SectionTitle>
        <span>📋</span>
        메뉴
      </SectionTitle> */}

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
