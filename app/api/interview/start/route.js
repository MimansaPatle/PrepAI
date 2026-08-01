import { NextResponse } from "next/server";
import { auth } from "@/auth";

import connectDB from "@/lib/mongodb";
import Interview from "@/models/Interview";
import User from "@/models/User";


export async function POST(req) {
  try {
    await connectDB();

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

    const body = await req.json();

    const {
      role,
      experience,
      difficulty,
      skills,
      company,
    } = body;

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const existingInterview = await Interview.findOne({
      user: user._id,
      status: "started",
      completedAt: null,
    });

    if (existingInterview) {
      return NextResponse.json({
        success: true,
        interviewId: existingInterview._id,
      });
    }

    const interview = await Interview.create({
      user: user._id,
      role,
      experience,
      difficulty,
      skills,
      company,
      status: "started",
    });

    return NextResponse.json({
      success: true,
      interviewId: interview._id,
    });

  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      {
        status: 500,
      }
    );
  }
}