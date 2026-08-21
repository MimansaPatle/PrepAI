import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Interview from "@/models/Interview";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({
      email: session.user.email,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const interviews = await Interview.find({
      user: user._id,
      status: "completed",
    }).sort({
      createdAt: -1,
    });

    const interviewCount = interviews.length;

    let averageScore = 0;

    if (interviewCount > 0) {
      averageScore =
        interviews.reduce(
          (sum, item) => sum + (item.feedback?.score || 0),
          0
        ) / interviewCount;
    }

    return NextResponse.json({
      success: true,

      user: {
        name: user.name,
        favoriteRole: user.favoriteRole,
        experience: user.experience,
      },

      averageScore: Math.round(averageScore),

      interviewCount,

      recentInterviews: interviews.slice(0, 5),
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