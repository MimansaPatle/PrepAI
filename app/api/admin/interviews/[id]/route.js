import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import Interview from "@/models/Interview";
import mongoose from "mongoose";

export async function GET(request, { params }) {
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

    // 2. Only admin can access
    if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 }
      );
    }

    // 3. Get interview ID from URL
    const { id } = await params;

    // 4. Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid interview ID",
        },
        { status: 400 }
      );
    }

    // 5. Connect to database
    await connectDB();

    // 6. Find interview
    const interview = await Interview.findById(id).populate(
      "user",
      "name email experience favoriteRole targetCompany"
    );

    if (!interview) {
      return NextResponse.json(
        {
          success: false,
          message: "Interview not found",
        },
        { status: 404 }
      );
    }

    // 7. Return full interview
    return NextResponse.json({
      success: true,
      interview,
    });

  } catch (error) {
    console.error("Admin interview details error:", error);

    return NextResponse.json(
  {
    success: false,
    message: "Failed to load interview details.",
  },
  { status: 500 }
);
  }
}