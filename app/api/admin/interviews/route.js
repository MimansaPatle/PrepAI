import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Interview from "@/models/Interview";

export async function GET() {
  try {
    const session = await auth();

    // Not logged in
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Not admin
    if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 }
      );
    }

    await connectDB();

    // Get all interviews + basic user information
    const interviews = await Interview.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const formattedInterviews = interviews.map((interview) => ({
      id: interview._id,

      user: {
        name: interview.user?.name || "Unknown User",
        email: interview.user?.email || "",
      },

      role: interview.role,
      experience: interview.experience,
      difficulty: interview.difficulty,

      status: interview.status,

      score:
        interview.status === "completed"
          ? interview.feedback?.score ?? null
          : null,

      createdAt: interview.createdAt,
      completedAt: interview.completedAt,
    }));

    return NextResponse.json({
      success: true,
      count: formattedInterviews.length,
      interviews: formattedInterviews,
    });
  } catch (error) {
    console.error("Admin interviews error:", error);

    return NextResponse.json(
  {
    success: false,
    message: "Failed to load interviews.",
  },
  { status: 500 }
);
  }
}