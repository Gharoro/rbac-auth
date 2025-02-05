import { Response } from "express";
import { ZodError } from "zod";
import { CustomError } from "../types/error.types";
import { logger } from "./logger";

export const apiResponse = (
  success: boolean,
  message: string,
  data?: Record<string, any> | any[]
) => {
  return {
    success,
    message,
    data: data ?? null,
  };
};

export const handleError = (res: Response, err: unknown) => {
  if (err instanceof ZodError) {
    const errors = {
      message: err.errors.map((e) => `${e.path}: ${e.message}`),
    };
    return res.status(400).json(apiResponse(false, "Validation Error", errors));
  }

  if (err instanceof Error) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json(apiResponse(false, "Access token expired"));
    } else {
      const error = err as CustomError;
      logger.error("Error:", error);
      return res
        .status(error.statusCode || 500)
        .json(apiResponse(false, error.message));
    }
  }

  logger.error("A server error occurred:", err);
  return res.status(500).json(apiResponse(false, "A server error occurred"));
};
