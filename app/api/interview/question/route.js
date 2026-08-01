import { NextResponse } from "next/server";
import { generateQuestion } from "@/services/gemini";

export async function POST(req) {
  try {
    const body = await req.json();

    const question = await generateQuestion(
  body.config,
  body.previousQuestions || [],
  body.previousAnswers || []
);

    return NextResponse.json({
      success: true,
      question,
    });

  }  catch (err) {

  if (
    err.message.includes("429") ||
    err.message.includes("RESOURCE_EXHAUSTED")
  ) {
    return NextResponse.json(
      {
        success: false,
        quotaExceeded: true,
        message:
          "Daily Gemini quota reached. Please try again tomorrow.",
      },
      { status: 429 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: error.message,
    },
    {
      status: 500,
    }
  );
}
}