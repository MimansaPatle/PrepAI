import { NextResponse } from "next/server";
import { generateFeedback } from "@/services/gemini";
import connectDB from "@/lib/mongodb";
import Interview from "@/models/Interview";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("========== FEEDBACK ROUTE ==========");
    console.log(body);

    await connectDB();

    console.log("Generating feedback...");

    const feedback = await generateFeedback(
      body.questions,
      body.answers,
      body.config
    );

    console.log("Feedback generated:");
    console.log(feedback);

    const updatedInterview = await Interview.findByIdAndUpdate(
      body.interviewId,
      {
        $set: {
          feedback,
        },
      },
      { new: true }
    );

    console.log("Mongo Updated:");
    console.log(updatedInterview);

    return NextResponse.json({
      success: true,
      feedback,
    });

  } catch (err) {
    console.log("========== ERROR ==========");
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: err.message,
        stack: err.stack,
      },
      { status: 500 }
    );
  }
}