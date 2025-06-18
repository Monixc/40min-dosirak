import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
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
import { generateRecipe } from "../services/openai";

const Container = styled.div`
  padding: 16px;
`;

const RECIPE_STORAGE_KEY = "recent_recipes";

function saveRecipesToStorage(recipes: Recipe[]) {
  localStorage.setItem(RECIPE_STORAGE_KEY, JSON.stringify(recipes));
}

function loadRecipesFromStorage(): Recipe[] {
  const data = localStorage.getItem(RECIPE_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

const savedCondiments = ["간장", "고추장", "된장", "소금", "후추"];
const savedIngredients = ["당근", "양파", "대파", "마늘", "생강"];

const Home = () => {
  const navigate = useNavigate();
  const [currentCard, setCurrentCard] = useState(0);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);
  const [offsetX, setOffsetX] = useState(0);
  const [ingredients, setIngredients] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    setRecipes(loadRecipesFromStorage());
  }, []);

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
      if (diff > 0 && currentCard < recipes.length - 1) {
        // 왼쪽으로 스와이프
        setCurrentCard((prev) => prev + 1);
      } else if (diff < 0 && currentCard > 0) {
        // 오른쪽으로 스와이프
        setCurrentCard((prev) => prev - 1);
      }
    }
    setOffsetX(0);
  };

  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const parseRecipeContent = (content: string) => {
    const lines = content.split("\n");
    let title = "";
    let ingredients = "";

    for (const line of lines) {
      if (line.startsWith("[레시피 제목]")) {
        title = lines[lines.indexOf(line) + 1].trim();
      } else if (line.startsWith("[재료]")) {
        const startIndex = lines.indexOf(line) + 1;
        const endIndex = lines.findIndex(
          (l, i) => i > startIndex && l.startsWith("[")
        );
        ingredients = lines
          .slice(startIndex, endIndex > -1 ? endIndex : undefined)
          .filter((l) => l.trim() && !l.includes("|"))
          .join(", ");
      }
    }

    return { title, ingredients };
  };

  const handleGenerateRecipe = async () => {
    if (!ingredients.trim()) {
      setError("재료를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const inputIngredients = ingredients.split(",").map((i) => i.trim());
      const recipeContent = await generateRecipe(
        inputIngredients,
        savedCondiments,
        savedIngredients
      );

      if (!recipeContent) {
        throw new Error("레시피 생성에 실패했습니다.");
      }

      const { title, ingredients: parsedIngredients } =
        parseRecipeContent(recipeContent);

      const newRecipe: Recipe = {
        id: Date.now(),
        title: title,
        ingredients: parsedIngredients,
        createdAt: formatDateTime(new Date()),
        input: ingredients,
        rawContent: recipeContent,
      };

      setRecipes((prev) => {
        const next = [newRecipe, ...prev].slice(0, 5);
        saveRecipesToStorage(next);
        return next;
      });
      setCurrentCard(0);
      setIngredients("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>레시피 생성하기</Title>
      <InputWrapper>
        <Input
          placeholder="재료를 입력하세요 (쉼표로 구분)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <Button onClick={handleGenerateRecipe} disabled={isLoading}>
          {isLoading ? "생성 중..." : "생성"}
        </Button>
      </InputWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <SectionTitle>
        <span>🕒</span>
        최근 생성한 레시피
      </SectionTitle>

      <SlideContainer>
        {recipes.length > 0 ? (
          <RecipeCard
            recipe={recipes[currentCard]}
            offset={offsetX}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            currentIndex={currentCard}
            totalRecipes={recipes.length}
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

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 8px;
`;
