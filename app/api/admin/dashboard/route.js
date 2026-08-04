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

    // 2. Check admin role
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

    // 4. Total users
    const totalUsers = await User.countDocuments({
      role: "user",
    });

    // 5. Total interviews
    const totalInterviews = await Interview.countDocuments();

    // 6. Completed interviews
    const completedInterviews = await Interview.countDocuments({
      status: "completed",
    });

    // 7. Get completed interviews that have scores
    const scoredInterviews = await Interview.find({
      status: "completed",
      "feedback.score": { $exists: true },
    }).select("feedback.score");

    // 8. Calculate overall average score
    let averageScore = 0;

    if (scoredInterviews.length > 0) {
      const totalScore = scoredInterviews.reduce(
        (sum, interview) => sum + (interview.feedback?.score || 0),
        0
      );

      averageScore = Math.round(
        totalScore / scoredInterviews.length
      );
    }

    // 9. Get 5 most recently registered users
    const recentUsersData = await User.find({
      role: "user",
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email favoriteRole experience createdAt");

    // 10. Calculate interview statistics for each user
    const recentUsers = await Promise.all(
      recentUsersData.map(async (user) => {
        const userInterviews = await Interview.find({
          user: user._id,
        }).select("status feedback.score");

        const completed = userInterviews.filter(
          (interview) => interview.status === "completed"
        );

        let avgScore = 0;

        if (completed.length > 0) {
          const totalScore = completed.reduce(
            (sum, interview) =>
              sum + (interview.feedback?.score || 0),
            0
          );

          avgScore = Math.round(
            totalScore / completed.length
          );
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          track: user.favoriteRole,
          experience: user.experience,
          interviews: userInterviews.length,
          score: avgScore,
        };
      })
    );

    // 11. Send everything to admin dashboard
    return NextResponse.json({
      success: true,

      metrics: {
        totalUsers,
        totalInterviews,
        completedInterviews,
        averageScore,
      },

      recentUsers,
    });

  } catch (error) {
    console.error("Admin dashboard error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}