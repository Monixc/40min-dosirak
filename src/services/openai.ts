import OpenAI from "openai";

function createOpenAIInstance(apiKey: string) {
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
}

export async function generateRecipe(
  requestText: string,
  condiments: string[],
  availableIngredients: string[]
): Promise<string | null> {
  const apiKey =
    localStorage.getItem("gpt_api_key") ||
    sessionStorage.getItem("gpt_api_key");

  if (!apiKey) {
    throw new Error("API 키가 설정되지 않았습니다.");
  }

  const prompt = `
당신은 사용자의 요청과 보유 재료를 바탕으로 최고의 레시피를 제안하는 요리 전문가입니다.

**[사용자 요청 사항]**
"${requestText}"

**[엄격한 조건]**
1.  **레시피 생성**: 위의 **[사용자 요청 사항]**을 최우선으로 분석하여 40분 안에 완성할 수 있는 창의적이고 정교한 레시피 1개를 제안해주세요.
2.  **재료 사용 규칙**:
    *   **주재료**: 레시피의 주재료는 반드시 **[사용자 요청 사항]**에서 언급된 것을 중심으로 사용해야 합니다.
    *   **부가 재료**: 추가적인 재료가 필요할 경우, 아래 **[추가 사용 가능 재료]** 목록에 있는 것들을 우선적으로 활용하세요.
    *   **기본 조미료 허용**: 만약 **[추가 사용 가능 재료]** 목록이 비어있거나 부족하면면 레시피 완성을 위해 '소금, 후추, 식용유, 물, 설탕'과 같은 **필수 기본 조미료**는 자유롭게 추가하여 사용할 수 있습니다. 하지만 선택된 조미료가 있다면 **[추가 사용 가능 재료]**만 사용해주세요.
    *   **예외 처리**: 위 조건으로도 사용자가 요청한 특정 요리(예: '김치찌개' 요청 시 김치가 없는 경우)를 만드는 것이 명백히 불가능할 경우에만 "요청하신 메뉴를 만들기 위한 핵심 재료가 부족합니다." 라고 정중하게 응답해주세요.
3.  **응답 형식**: 반드시 아래의 형식에 맞춰 한글로만 응답해주세요. 각 섹션의 제목(예: '[레시피 제목]')은 그대로 유지해야 합니다.

**[추가 사용 가능 재료]**
*   **보유 조미료**: ${condiments.join(", ") || "선택된 항목 없음"}
*   **보유 식재료**: ${availableIngredients.join(", ") || "선택된 항목 없음"}

**[응답 형식]**
[레시피 제목]
(여기에 생성된 레시피의 제목을 입력)

[재료]
재료명 | 용량
(여기에 필요한 재료와 정확한 용량을 '재료명 | 용량' 형식으로 나열)

[조리 순서]
1. (첫 번째 조리 단계 설명)
2. (두 번째 조리 단계 설명)
...

[팁]
(여기에 요리 팁, 대체 가능한 재료, 또는 보관 방법 등을 자유롭게 작성)
`;

  try {
    const openai = createOpenAIInstance(apiKey);

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
  } catch (error) {
    console.error("레시피 생성 오류:", error);
    throw new Error("레시피 생성 중 오류가 발생했습니다.");
  }
}
