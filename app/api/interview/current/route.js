import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Interview from "@/models/Interview";
import User from "@/models/User";

export async function GET() {
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

    const user = await User.findOne({
      email: session.user.email,
    });

    const interview = await Interview.findOne({
      user: user._id,
      status: "started",
      completedAt: null,
      "questions.0": { $exists: true },
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      interview,
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