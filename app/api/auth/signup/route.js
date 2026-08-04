import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";    //it is used to send a response back to the client in a Next.js API route. 
import bcrypt from "bcryptjs";          //it is used to hash passwords before storing them in the database and to compare hashed passwords during loginn

export async function POST(request) {
    try {

        await connectDB();

        const body = await request.json();

        const {
            name,
            email,
            password,
            experience,
            favoriteRole,
            targetCompany,
            skills,
        } = body;

        if (
            !name ||
            !email ||
            !password ||
            !experience ||
            !favoriteRole
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All fields are required.",
                },
                {
                    status: 400,           // 400 is the status code for bad request, which means the server cannot process the request due to client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
                }
            );
        }

        // Normalize email FIRST
        const normalizedEmail = email.trim().toLowerCase();

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please enter a valid email address.",
                },
                {
                    status: 400,
                }
            );
        }

        // Validate password
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(password)) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character.",
                },
                {
                    status: 400,
                }
            );
        }


        // Check duplicate email
        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User already exists.",
                },
                {
                    status: 409,   // 409 is the status code for conflict, which means the request could not be completed due to a conflict with the current state of the target resource. In this case, it indicates that a user with the provided email already exists in the database.
                }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            experience,
            favoriteRole,
            targetCompany,
            skills,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Account created successfully.",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    experience: user.experience,
                    favoriteRole: user.favoriteRole,
                    targetCompany: user.targetCompany,
                    skills: user.skills,
                },
            },
            {
                status: 201,
            }
        );

    } catch (error) {
        console.error("Signup error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create account.",
            },
            {
                status: 500,
            }
        );
    }
}