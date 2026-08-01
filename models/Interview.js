import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        role: {
            type: String,
            required: true,
        },

        experience: {
            type: String,
            required: true,
        },

        difficulty: {
            type: String,
            required: true,
        },

        company: {
            type: String,
            default: "",
        },

        skills: {
            type: String,
            default: "",
        },

        questions: [
            {
                question: String,
                answer: String,
            },
        ],

        feedback: {

            score: Number,

            recommendation: String,

            summary: String,

            metrics: {

                communication: {

                    score: Number,

                    reason: String

                },

                technicalKnowledge: {

                    score: Number,

                    reason: String

                },

                confidence: {

                    score: Number,

                    reason: String

                },

                problemSolving: {

                    score: Number,

                    reason: String

                }

            },

            strengths: [String],

            weaknesses: [String],

            questionFeedback: [

                {

                    question: String,

                    candidateAnswer: String,

                    score: Number,

                    strengths: [String],

                    weaknesses: [String],

                    idealAnswer: String

                }

            ],

            roadmap: [

                {

                    day: String,

                    topic: String,

                    goal: String,

                    resource: String

                }

            ],

            placementReadiness: {

                TCS: Number,

                Infosys: Number,

                Accenture: Number,

                Capgemini: Number,

                Amazon: Number,

                Google: Number

            }

        },



        status: {
            type: String,
            enum: ["started", "completed"],
            default: "started",
        },
        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Interview ||
    mongoose.model("Interview", InterviewSchema);