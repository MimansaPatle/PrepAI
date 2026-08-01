import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/mongodb";
import SupportMessage from "@/models/SupportMessage";

export async function POST(request) {
  try {
    // Check logged-in user
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Get form data
    const body = await request.json();

    const { subject, message } = body;

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject and message are required.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Create support message
    const supportMessage = await SupportMessage.create({
      user: session.user.id,
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent.",
         
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Support message error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send support message.",
      },
      { status: 500 }
    );
  }
}