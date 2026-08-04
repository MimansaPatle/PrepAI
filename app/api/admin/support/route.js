import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import SupportMessage from "@/models/SupportMessage";

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

    // 2. Only admin can access support messages
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

    // 4. Get all support messages
    const messages = await SupportMessage.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // 5. Return messages
    return NextResponse.json({
      success: true,
      count: messages.length,
      messages,
    });

  } catch (error) {
    console.error("Admin support error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load support messages.",
      },
      { status: 500 }
    );
  }
}