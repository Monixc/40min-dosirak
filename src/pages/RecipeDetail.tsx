import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import type { Recipe } from "../types";

const Container = styled.div`
  padding: 24px;
  color: #fff;
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
  background: #222;
  border-radius: 8px;
  padding: 16px;
  color: #fff;
`;

const BackButton = styled.button`
  margin-top: 24px;
  padding: 8px 16px;
  background: #444;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

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

  // 조리 순서 파싱
  let steps: string[] = [];
  if (stepMatch) {
    steps = stepMatch[1]
      .split("\n")
      .map((l) => l.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);
  }

  return { ingredients, steps };
}

export default function RecipeDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state as Recipe | undefined;

  if (!recipe) {
    return <Container>레시피 정보를 찾을 수 없습니다.</Container>;
  }

  const { ingredients, steps } = parseRecipeDetail(recipe.rawContent || "");

  return (
    <Container>
      <Title>{recipe.title}</Title>
      <Date>{recipe.createdAt}</Date>
      <Input>입력한 재료: {recipe.input}</Input>
      <h3>재료</h3>
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
      <h3>조리 순서</h3>
      <StepList>
        {steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </StepList>
      <BackButton onClick={() => navigate(-1)}>뒤로가기</BackButton>
    </Container>
  );
}
