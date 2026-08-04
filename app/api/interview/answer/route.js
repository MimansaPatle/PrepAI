import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Interview from "@/models/Interview";

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

    const body = await req.json();

    const {
      interviewId,
      question,
      answer,
    } = body;

   const interview = await Interview.findOne({
  _id: interviewId,
  user: session.user.id,
});

// Interview doesn't exist OR doesn't belong to this user
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

// Don't allow answers after completion
if (interview.status === "completed") {
  return NextResponse.json(
    {
      success: false,
      message: "Interview already completed",
    },
    {
      status: 400,
    }
  );
}

    interview.questions.push({
      question,
      answer,
    });

    await interview.save();

    return NextResponse.json({
      success: true,
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