import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import type { Recipe } from "../types";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

const Container = styled.div`
  padding: 16px;
  color: #fff;
  padding-bottom: 120px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 12px;
`;

const Date = styled.div`
  color: #aaa;
  font-size: 14px;
  margin-bottom: 16px;
`;

const Input = styled.div`
  color: #bbb;
  font-size: 15px;
  margin-bottom: 16px;
`;

const Table = styled.table`
  width: 100%;
  background: #222;
  border-radius: 8px;
  margin-top: 12px;
  margin-bottom: 20px;
  border-collapse: collapse;
  th,
  td {
    border: 1px solid #444;
    padding: 8px;
    text-align: left;
    color: #fff;
  }
  th {
    background: #333;
  }
`;

const StepList = styled.ol`
  margin-top: 12px;
  background: #222;
  border-radius: 8px;
  padding: 14px;
  color: #fff;
  word-break: break-word;
  white-space: pre-line;
  overflow-wrap: break-word;
  font-size: 15px;
  margin-bottom: 24px;
  max-width: 100%;
  box-sizing: border-box;
`;

const StepItem = styled.li`
  margin-bottom: 6px;
  line-height: 1.6;
  list-style: none;
`;

const StepIndex = styled.span`
  min-width: 2em;
  text-align: right;
  margin-right: 8px;
  color: rgb(255, 255, 255);
  font-weight: bold;
  flex-shrink: 0;
`;

const StepText = styled.span`
  flex: 1 1 0;
  word-break: break-word;
  white-space: pre-line;
`;

const ActionRow = styled.div`
  position: fixed;
  left: 0;
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

const BackButton = styled.button`
  flex: 1 1 0;
  padding: 16px 0;
  background: #444;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
`;

const StarButton = styled.button<{ $active?: boolean }>`
  width: 56px;
  height: 56px;
  background: #444;
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 28px;
  color: ${({ $active }) => ($active ? "#ffd700" : "#aaa")};
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #333;
  }
`;

const TipBox = styled.div`
  background: #333;
  border-radius: 8px;
  padding: 16px;
  margin-top: 12px;
  white-space: pre-line;
  font-size: 15px;
  line-height: 1.6;
`;

const ConfirmModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;
const ConfirmModalBox = styled.div`
  background: #232323;
  border-radius: 12px;
  padding: 32px 24px 24px 24px;
  max-width: 320px;
  width: 90vw;
  color: #fff;
  font-size: 14px;
  text-align: center;
`;
const ConfirmModalButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  justify-content: center;
`;
const ConfirmButton = styled.button`
  flex: 1 1 0;
  padding: 12px 0;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;

const LIKED_RECIPES_KEY = "liked_recipes";

function saveLikedRecipe(recipe: Recipe) {
  const data = localStorage.getItem(LIKED_RECIPES_KEY);
  let liked: Recipe[] = [];
  if (data) {
    try {
      liked = JSON.parse(data);
    } catch {}
  }
  // 중복 저장 방지 (id 기준)
  if (!liked.some((r) => r.id === recipe.id)) {
    liked = [recipe, ...liked];
    localStorage.setItem(LIKED_RECIPES_KEY, JSON.stringify(liked));
  }
}

function parseRecipeDetail(raw: string) {
  // [재료] ~ [조리 순서] 파싱
  const ingredientMatch = raw.match(/\[재료\]([\s\S]*?)\[조리 순서\]/);
  const stepMatch = raw.match(/\[조리 순서\]([\s\S]*)/);

  // 재료 표 파싱
  let ingredients: { name: string; amount: string }[] = [];
  if (ingredientMatch) {
    const lines = ingredientMatch[1]
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    ingredients = lines
      .filter((line) => line.includes("|"))
      .map((line) => {
        const [name, amount] = line.split("|").map((s) => s.trim());
        return { name, amount };
      });
  }

  // 조리 순서와 팁 분리
  let steps: string[] = [];
  let tipLines: string[] = [];
  if (stepMatch) {
    const allSteps = stepMatch[1]
      .split("\n")
      .map((l) => l.replace(/^\d+(\.\d+)*\.\s*/, "").trim())
      .filter(Boolean);

    allSteps.forEach((line) => {
      if (
        line.startsWith("[팁]") ||
        line.startsWith("-") ||
        line.startsWith("*")
      ) {
        tipLines.push(line);
      } else {
        steps.push(line);
      }
    });
  }

  const tip = tipLines.join("\n");

  return { ingredients, steps, tip };
}

function ConfirmModal({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <ConfirmModalOverlay>
      <ConfirmModalBox>
        <div style={{ marginBottom: 12 }}>
          저장된 레시피가 삭제됩니다.
          <br />
          취소하시겠습니까?
        </div>
        <ConfirmModalButtonRow>
          <ConfirmButton
            style={{ background: "#ff6b6b", color: "#fff" }}
            onClick={onConfirm}>
            확인
          </ConfirmButton>
          <ConfirmButton
            style={{ background: "#444", color: "#fff" }}
            onClick={onCancel}>
            취소
          </ConfirmButton>
        </ConfirmModalButtonRow>
      </ConfirmModalBox>
    </ConfirmModalOverlay>
  );
}

export default function RecipeDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state as Recipe | undefined;
  const [liked, setLiked] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!recipe) return;
    const data = localStorage.getItem(LIKED_RECIPES_KEY);
    if (data) {
      try {
        const likedList: Recipe[] = JSON.parse(data);
        setLiked(likedList.some((r) => r.id === recipe.id));
      } catch {}
    }
  }, [recipe?.id]);

  const handleLike = () => {
    if (!recipe) return;
    if (liked) {
      setShowConfirm(true);
      return;
    }
    saveLikedRecipe(recipe);
    setLiked(true);
  };

  const handleConfirmRemove = () => {
    if (!recipe) return;
    // 로컬스토리지에서 삭제
    const data = localStorage.getItem(LIKED_RECIPES_KEY);
    if (data) {
      try {
        const likedList: Recipe[] = JSON.parse(data);
        const updated = likedList.filter((r) => r.id !== recipe.id);
        localStorage.setItem(LIKED_RECIPES_KEY, JSON.stringify(updated));
      } catch {}
    }
    setLiked(false);
    setShowConfirm(false);
    navigate(-1); // 목록으로 이동
  };

  if (!recipe) {
    return <Container>레시피 정보를 찾을 수 없습니다.</Container>;
  }

  const { ingredients, steps, tip } = parseRecipeDetail(
    recipe.rawContent || ""
  );

  return (
    <Container>
      <Title>{recipe.title}</Title>
      <Date>{recipe.createdAt}</Date>
      <Input> 프롬프트: {recipe.input}</Input>
      <h3>🥕 재료</h3>
      <Table>
        <thead>
          <tr>
            <th>재료명</th>
            <th>용량</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((row, i) => (
            <tr key={i}>
              <td>{row.name}</td>
              <td>{row.amount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h3>🍳 조리 순서</h3>
      <StepList>
        {steps.map((step, i) => (
          <StepItem key={i}>
            <StepIndex>{i + 1}.</StepIndex>
            <StepText>{step}</StepText>
          </StepItem>
        ))}
      </StepList>
      {tip && (
        <>
          <h3>💡팁</h3>
          <TipBox>{tip.replace(/^\[?팁\]?[:：]?/i, "").trim()}</TipBox>
        </>
      )}
      <ActionRow>
        <BackButton onClick={() => navigate(-1)}>뒤로가기</BackButton>
        <StarButton
          aria-label="좋아요"
          title="좋아요"
          $active={liked}
          onClick={handleLike}>
          <Icon icon="mdi:star" width="32" height="32" />
        </StarButton>
      </ActionRow>
      <ConfirmModal
        open={showConfirm}
        onConfirm={handleConfirmRemove}
        onCancel={() => setShowConfirm(false)}
      />
    </Container>
  );
}
