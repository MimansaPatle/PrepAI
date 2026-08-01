import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },

    favoriteRole: {
      type: String,
      required: true,
    },

    targetCompany: {
      type: String,
      default: "",
    },

    skills: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User ||
  mongoose.model("User", UserSchema);  // Next.js is different. Remember Hot Reload? Every save reloads files. If we always create

export default User;