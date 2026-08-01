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

    const interview = await Interview.findOne({
      _id: interviewId,
      user: session.user.id,
    });

    // Interview doesn't exist OR doesn't belong to logged-in user
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

    // Already completed
    if (interview.status === "completed") {
      return NextResponse.json({
        success: true,
        interviewId: interview._id,
        message: "Interview already completed",
      });
    }


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