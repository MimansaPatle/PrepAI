import { NextResponse } from "next/server";
import { auth } from "@/auth";

import connectDB from "@/lib/mongodb";
import Interview from "@/models/Interview";



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



    const existingInterview = await Interview.findOne({
      user: session.user.id,
      status: "started",
      completedAt: null,
      role,
      difficulty,
      experience,
      skills: skills || "",
      company: company || "",
    });

    if (existingInterview) {
      return NextResponse.json({
        success: true,
        interviewId: existingInterview._id,
      });
    }

    const interview = await Interview.create({
      user: session.user.id,
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