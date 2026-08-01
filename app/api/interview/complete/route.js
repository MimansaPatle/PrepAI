import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Interview from "@/models/Interview";
import { generateFeedback } from "@/services/gemini";

export async function POST(req) {
  try {
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

    await connectDB();

    const { interviewId } = await req.json();

    const interview = await Interview.findById(interviewId);
    if (interview.status === "completed") {
      return NextResponse.json({
        success: true,
        interviewId: interview._id,
        message: "Interview already completed",
      });
    }

    if (!interview) {
      return NextResponse.json(
        {
          success: false,
          message: "Interview not found",
        },
        {
          status: 404,
        }
      );
    }
    console.log("Generating feedback for:", interview._id);
    console.log("Current status:", interview.status);
    console.log("Questions:", interview.questions.length);
    // Generate AI feedback
    const feedback = await generateFeedback(
      interview.questions.map((q) => q.question),
      interview.questions.map((q) => q.answer),
      interview
    );
    console.log("Generated score:", feedback.score);

    // Save feedback
    interview.feedback = feedback;

    // Mark completed
    interview.status = "completed";
    interview.completedAt = new Date();

    await interview.save();

    return NextResponse.json({
      success: true,
      interviewId: interview._id,
    });

  } catch (error) {
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