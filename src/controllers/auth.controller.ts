import { Request, Response } from "express";
import { AuthService } from "../services/auth.services";
import { LoginInput, RegisterInput } from "../types/interface";
import { apiResponse, handleError } from "../utils/apiResponse";
import { registerSchema } from "../utils/validation";
import { CustomError } from "../types/error.types";
import { encryptJwtToken } from "../utils/jwt.utils";

export class AuthController {
  // Register A New User
  static async register(req: Request, res: Response): Promise<any> {
    try {
      const validatedData: RegisterInput = registerSchema.parse(req.body);

      await AuthService.register(validatedData);

      return res
        .status(201)
        .json(apiResponse(true, "User registered successfully"));
    } catch (err) {
      return handleError(res, err);
    }
  }

  // Login A User, returns an encrypted access token and a refresh token
  static async login(req: Request, res: Response): Promise<any> {
    try {
      const { email, password }: LoginInput = req.body;
      const { accessToken, refreshToken } = await AuthService.login(
        email,
        password
      );

      // Encrypt access token for an extra layer of security
      const encryptedJwt = encryptJwtToken(accessToken);

      const result = {
        accessToken: encryptedJwt,
        refreshToken,
      };

      return res
        .status(200)
        .json(apiResponse(true, "User logged in successfully", result));
    } catch (err) {
      return handleError(res, err);
    }
  }

  // Refresh a Token
  static async refreshToken(req: Request, res: Response): Promise<any> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        const error: CustomError = new Error(
          "Refresh token required"
        ) as CustomError;
        error.statusCode = 400;
        throw error;
      }

      const tokens = await AuthService.refreshToken(refreshToken);

      return res.status(200).json(apiResponse(true, "Token refreshed", tokens));
    } catch (err) {
      handleError(res, err);
      return;
    }
  }

  // Logout user
  static async logout(req: Request, res: Response): Promise<any> {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        const error: CustomError = new Error(
          "Refresh token required"
        ) as CustomError;
        error.statusCode = 400;
        throw error;
      }

      await AuthService.logout(refreshToken);

      return res
        .status(200)
        .json(apiResponse(true, "User logged out successfully"));
    } catch (err) {
      return handleError(res, err);
    }
  }
}
