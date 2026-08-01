import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateQuestion(
  config,
  previousQuestions = [],
  previousAnswers = []
) {
  const history = previousQuestions
    .map((q, i) => {
      const answer = previousAnswers[i] || "";
      return `
Question ${i + 1}:
${q}

Candidate Answer:
${answer}
`;
    })
    .join("\n");

  const prompt = `
You are an experienced senior software engineer conducting a REAL interview.

Candidate Details:

Role: ${config.role}
Experience: ${config.experience}
Difficulty: ${config.difficulty}
Target Company: ${config.company}
Skills: ${config.skills}

Interview History:

${history || "No previous questions."}

Instructions:

- Ask ONE interview question only.
- If this is not the first question, your next question MUST depend on the candidate's previous answer.
- If the answer was weak, ask an easier follow-up.
- If the answer was strong, ask a deeper technical follow-up.
- Never repeat a previous question.
- Behave exactly like a human interviewer.
- Return ONLY the question.

`;
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
  });

  return response.text.trim();
}

export async function generateFeedback(
  questions,
  answers,
  config
) {

const prompt = `
You are a Senior Software Engineering Interviewer at Google.

You are evaluating a REAL technical interview.

Candidate Details

Role: ${config.role}
Experience: ${config.experience}
Difficulty: ${config.difficulty}
Target Company: ${config.company}
Skills: ${config.skills}

==========================

Interview

${questions.map((q,i)=>`

Question ${i+1}

${q}

Candidate Answer

${answers[i]}

`).join("\n")}

==========================

Evaluation Rules

1. Be STRICT.

2. Never give high scores for incorrect answers.

3. If candidate writes:
- idk
- I don't know
- skipped
- timer expired

deduct marks.

4. Evaluate:

- Communication
- Technical Knowledge
- Confidence
- Problem Solving

5. Score must be realistic.

0-40 = Poor

41-60 = Beginner

61-75 = Average

76-90 = Good

91-100 = Excellent

6. For EACH question provide:

- score (/10)

- strengths

- weaknesses

- ideal answer

7. Generate an improvement roadmap.

8. Recommend whether candidate is:

Strong Hire

Hire

Borderline

Needs Improvement

Reject

9. Estimate placement readiness.

10. Return ONLY valid JSON.

No markdown.

No explanation.

Return EXACTLY this format:

{
  "score":75,

  "recommendation":"Borderline",

  "summary":"...",

  "metrics":{

      "communication":{
          "score":4,
          "reason":"..."
      },

      "technicalKnowledge":{
          "score":3,
          "reason":"..."
      },

      "confidence":{
          "score":3,
          "reason":"..."
      },

      "problemSolving":{
          "score":2,
          "reason":"..."
      }

  },

  "strengths":[
      "...",
      "...",
      "..."
  ],

  "weaknesses":[
      "...",
      "...",
      "..."
  ],

  "questionFeedback":[

      {

          "question":"",

          "candidateAnswer":"",

          "score":6,

          "strengths":[
              "...",
              "..."
          ],

          "weaknesses":[
              "...",
              "..."
          ],

          "idealAnswer":"..."
      }

  ],

  "roadmap":[

      {

          "day":"Monday",

          "topic":"React Hooks",

          "goal":"Understand dependency array",

          "resource":"https://react.dev"
      },

      {

          "day":"Tuesday",

          "topic":"JavaScript Closures",

          "goal":"Solve closure questions",

          "resource":"https://developer.mozilla.org"
      },

      {

          "day":"Wednesday",

          "topic":"DSA",

          "goal":"Practice Arrays",

          "resource":"LeetCode"
      },

      {

          "day":"Thursday",

          "topic":"System Design",

          "goal":"Basic REST API",

          "resource":"YouTube"
      }

  ],

  "placementReadiness":{

      "TCS":5,

      "Infosys":5,

      "Accenture":4,

      "Capgemini":4,

      "Amazon":2,

      "Google":1

  }

}
`;

try{

const response=await ai.models.generateContent({

model:"gemini-3.5-flash",

contents:prompt

});

const raw = response.text.trim();

console.log(raw);

const json = raw.match(/\{[\s\S]*\}/);
if(!json){

throw new Error("Gemini returned invalid JSON");

}

return JSON.parse(json[0]);

}catch(err){

console.log(err);

throw err;

}

}