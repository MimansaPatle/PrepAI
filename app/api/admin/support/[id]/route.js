import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import SupportMessage from "@/models/SupportMessage";
import mongoose from "mongoose";

export async function PATCH(request, { params }) {
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

    // 3. Get message ID
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid message ID",
        },
        { status: 400 }
      );
    }

    // 4. Get requested status
    const body = await request.json();
    const { status } = body;

    if (!["new", "resolved"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status",
        },
        { status: 400 }
      );
    }

    // 5. Connect to MongoDB
    await connectDB();

    // 6. Update message
    const updatedMessage = await SupportMessage.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedMessage) {
      return NextResponse.json(
        {
          success: false,
          message: "Support message not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Support message updated.",
      supportMessage: updatedMessage,
    });

  } catch (error) {
    console.error("Update support status error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update support message.",
      },
      { status: 500 }
    );
  }
}