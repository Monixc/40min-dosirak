import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeCard, EmptyCard } from "../components/common/Card";
import { SquareCard } from "../components/common/Card/SquareCard";
import type { Recipe } from "../types";
import styled from "styled-components";

const LIKED_RECIPES_KEY = "liked_recipes";

const FixedBackButton = styled.button`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 24px;
  width: calc(100% - 32px);
  max-width: 440px;
  padding: 16px 0;
  background: #444;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
`;

const PageContainer = styled.div`
  padding: 16px;
  max-width: 480px;
  margin: 0 auto;
  padding-bottom: 120px;
`;

const Title = styled.h2`
  font-size: 22px;
  color: #fff;
  margin-bottom: 12px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
`;

export default function Recipe() {
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const listEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem(LIKED_RECIPES_KEY);
    if (data) {
      try {
        setLikedRecipes(JSON.parse(data));
      } catch {
        setLikedRecipes([]);
      }
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (
      listEndRef.current &&
      listEndRef.current.getBoundingClientRect().bottom <= window.innerHeight
    ) {
      setVisibleCount((prev) => prev + 10);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <PageContainer>
      <Title>❤️ 좋아요 한 레시피</Title>
      {likedRecipes.length === 0 ? (
        <EmptyCard />
      ) : (
        <>
          <GridContainer>
            {likedRecipes.slice(0, visibleCount).map((recipe) => (
              <SquareCard key={recipe.id} recipe={recipe} />
            ))}
          </GridContainer>
          <div ref={listEndRef} />
        </>
      )}
      <FixedBackButton onClick={() => navigate(-1)}>뒤로가기</FixedBackButton>
    </PageContainer>
  );
}
