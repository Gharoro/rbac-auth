import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.utils";
import { RegisterInput } from "../types/interface";
import { UserRole } from "../types/enum";
import { CustomError } from "../types/error.types";
import { RefreshToken } from "../models/refreshToken.model";

export class AuthService {
  static async register(data: RegisterInput) {
    const { firstName, lastName, email, password, role } = data;

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      const error: CustomError = new Error("Invalid role") as CustomError;
      error.statusCode = 400;
      throw error;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error: CustomError = new Error(
        "User with this email already exists"
      ) as CustomError;
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });
    await user.save();

    return user;
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      const error: CustomError = new Error(
        "Invalid credentials"
      ) as CustomError;
      error.statusCode = 401;
      throw error;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      const error: CustomError = new Error(
        "Invalid credentials"
      ) as CustomError;
      error.statusCode = 401;
      throw error;
    }

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return { accessToken, refreshToken };
  }

  static async refreshToken(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);

    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      userId: decoded.userId,
    });

    if (!storedToken) {
      const error: CustomError = new Error(
        "Invalid refresh token"
      ) as CustomError;
      error.statusCode = 401;
      throw error;
    }

    // Generate new access token
    const user = await User.findById(decoded.userId);
    if (!user) {
      const error: CustomError = new Error("User not found") as CustomError;
      error.statusCode = 404;
      throw error;
    }

    const newAccessToken = generateAccessToken(user);
    return { accessToken: newAccessToken };
  }

  static async logout(refreshToken: string) {
    await RefreshToken.findOneAndDelete({ token: refreshToken });
  }
}
