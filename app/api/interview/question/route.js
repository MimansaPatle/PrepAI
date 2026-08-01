import { NextResponse } from "next/server";
import { generateQuestion } from "@/services/gemini";
import { auth } from "@/auth";

export async function POST(req) {
  try {
    // 1. User must be logged in
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // 2. Get request data
    const body = await req.json();

    // 3. Generate question
    const question = await generateQuestion(
      body.config,
      body.previousQuestions || [],
      body.previousAnswers || []
    );

    return NextResponse.json({
      success: true,
      question,
    });

  } catch (err) {

    // Gemini quota error
    if (
      err.message?.includes("429") ||
      err.message?.includes("RESOURCE_EXHAUSTED")
    ) {
      return NextResponse.json(
        {
          success: false,
          quotaExceeded: true,
          message:
            "Daily Gemini quota reached. Please try again tomorrow.",
        },
        {
          status: 429,
        }
      );
    }

    console.error("Question generation error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to generate question",
      },
      {
        status: 500,
      }
    );
  }
}