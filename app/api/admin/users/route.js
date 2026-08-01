import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Interview from "@/models/Interview";

export async function GET() {
  try {
    // 1. Check authentication
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

    // 2. Only admin can access this API
    if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 }
      );
    }

    // 3. Connect to MongoDB
    await connectDB();

    // 4. Get all users
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select(
        "name email role experience favoriteRole targetCompany createdAt"
      );

    // 5. Add interview information for every user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const interviews = await Interview.find({
          user: user._id,
        }).select("status feedback.score");

        const completedInterviews = interviews.filter(
          (interview) => interview.status === "completed"
        );

        let averageScore = 0;

        if (completedInterviews.length > 0) {
          const totalScore = completedInterviews.reduce(
            (sum, interview) =>
              sum + (interview.feedback?.score || 0),
            0
          );

          averageScore = Math.round(
            totalScore / completedInterviews.length
          );
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
          experience: user.experience,
          favoriteRole: user.favoriteRole,
          targetCompany: user.targetCompany,
          totalInterviews: interviews.length,
          completedInterviews: completedInterviews.length,
          averageScore,
          joinedAt: user.createdAt,
        };
      })
    );

    // 6. Send users to frontend
    return NextResponse.json({
      success: true,
      count: usersWithStats.length,
      users: usersWithStats,
    });

  } catch (error) {
  console.error("Admin users error:", error);

  return NextResponse.json(
    {
      success: false,
      message: "Failed to load users.",
    },
    { status: 500 }
  );
}
}