// scripts/main.js

// 질문 항목 로딩 (예시 정적 구성)
const questionList = [
  { id: "mood", question: "오늘 기분은 어떤가요?", options: ["상쾌함", "무기력함", "짜증남", "피곤함"] },
  { id: "hunger", question: "현재 배고픔 정도는?", options: ["아주 배고픔", "적당함", "입맛 없음"] },
  { id: "condition", question: "몸 상태는 어떤가요?", options: ["정상", "숙취", "속 불편함"] },
  { id: "companion", question: "혼밥인가요?", options: ["혼자", "여럿이"] },
  { id: "budget", question: "예산은 얼마인가요?", options: ["만원 이하", "만오천원", "이만원 이상"] },
  { id: "foodType", question: "선호하는 음식 종류는?", options: ["밥", "면", "국물", "샐러드"] },
  { id: "taste", question: "선호하는 맛은?", options: ["매운", "짠", "담백한", "고소한"] },
  { id: "avoid", question: "피하고 싶은 재료가 있나요?", options: ["없음", "해산물", "밀가루", "육류"] },
  { id: "recent", question: "최근 먹은 점심은?", options: ["김치찌개", "돈까스", "샐러드", "라면"] },
  { id: "desire", question: "오늘 점심에 바라는 건?", options: ["든든함", "가벼움", "위로받고 싶음"] }
];

const questionContainer = document.getElementById("question-container");
const form = document.getElementById("question-form");
const resultSection = document.getElementById("result-section");
const menuResult = document.getElementById("menu-result");
let recommendedMenu = "";

function createQuestion({ id, question, options }) {
  const div = document.createElement("div");
  div.className = "question-block";
  const label = document.createElement("label");
  label.innerText = question;
  div.appendChild(label);

  const select = document.createElement("select");
  select.id = id;
  select.required = true;
  options.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.innerText = opt;
    select.appendChild(option);
  });
  div.appendChild(select);
  return div;
}

function loadQuestions() {
  questionList.forEach(q => {
    questionContainer.appendChild(createQuestion(q));
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const answers = {};
  questionList.forEach(q => {
    const el = document.getElementById(q.id);
    answers[q.id] = el.value;
  });

  // 날씨/위치 자동 수집은 별도 구현 필요 (예: window.currentWeather)
  const prompt = `사용자의 점심 메뉴를 추천해주세요. 조건:
${Object.entries(answers).map(([k, v]) => `- ${k}: ${v}`).join("\n")}
형식: \n추천 메뉴: \n추천 이유:`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_GPT_API_KEY"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "당신은 점심 메뉴를 추천해주는 전문가입니다." },
          { role: "user", content: prompt }
        ]
      })
    });
    const data = await response.json();
    const resultText = data.choices[0].message.content;

    resultSection.style.display = "block";
    menuResult.innerText = resultText;
    recommendedMenu = resultText.match(/추천 메뉴:\s*(.+)/)?.[1] || "";
  } catch (err) {
    alert("메뉴 추천 중 오류가 발생했습니다.");
    console.error(err);
  }
});

window.addEventListener("DOMContentLoaded", loadQuestions);
