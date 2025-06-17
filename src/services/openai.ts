import OpenAI from "openai";

export const createOpenAIInstance = (apiKey: string) => {
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
};

export const generateRecipe = async (
  ingredients: string[],
  condiments: string[],
  availableIngredients: string[]
) => {
  const apiKey =
    localStorage.getItem("gpt_api_key") ||
    sessionStorage.getItem("gpt_api_key");
  if (!apiKey) throw new Error("API 키가 설정되지 않았습니다.");

  const openai = createOpenAIInstance(apiKey);

  const prompt = `
도시락 레시피를 생성해주세요.

조건:
1. 40분 이내 완성 가능한 레시피
2. 아래 재료들만 사용 가능:
   - 주재료: ${ingredients.join(", ")}
   - 조미료: ${condiments.join(", ")}
   - 가용 식재료: ${availableIngredients.join(", ")}
3. 단순 조리(구이, 찜, 삶기)가 아닌 정교한 레시피 제공
4. 아래 형식으로 응답:

[레시피 제목]
예시: 김치찜, 계란말이, 된장찌개 등

[재료]
재료명 | 용량
예시:
당근 | 1/2개
간장 | 2큰술

[조리 순서]
1. 첫 번째 단계
2. 두 번째 단계
...

한글로 응답해주세요.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content:
            "당신은 전문 요리사입니다. 주어진 재료로 맛있는 도시락 레시피를 제공합니다.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("레시피 생성 오류:", error);
    throw new Error("레시피 생성 중 오류가 발생했습니다.");
  }
};
