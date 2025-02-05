import { Request, Response, NextFunction } from "express";
import { decryptJwtToken, verifyAccessToken } from "../utils/jwt.utils";
import { apiResponse, handleError } from "../utils/apiResponse";

export const authMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res
        .status(401)
        .json(apiResponse(false, "Access denied. No token provided."));
      return;
    }

    try {
      const decryptedToken = decryptJwtToken(token);
      const decoded = verifyAccessToken(decryptedToken);
      if (!roles.includes(decoded.role)) {
        res
          .status(403)
          .json(apiResponse(false, "Access denied. Insufficient permissions."));
        return;
      }
      req.user = decoded;
      next();
    } catch (err) {
      handleError(res, err);
      return;
    }
  };
};
