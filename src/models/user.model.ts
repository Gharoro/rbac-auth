import mongoose from "mongoose";
import { UserRole } from "../types/enum";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
