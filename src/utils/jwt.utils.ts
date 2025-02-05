import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IUser } from "../types/interface";
import { RefreshToken } from "../models/refreshToken.model";
import { createCipheriv, createDecipheriv } from "crypto";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const JWT_EXPIRES_IN =
  parseInt(process.env.JWT_EXPIRES_IN as string, 10) || "1hr";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";

const encryptionType = process.env.JWT_ENCRYPTION_TYPE ?? "";
const encryptionKey = process.env.JWT_ENCRYPTION_KEY ?? "";
const encryptionIv = process.env.JWT_ENCRYPTION_IV ?? "";

export const generateAccessToken = (user: IUser): string => {
  const { _id, firstName, lastName, email, role } = user;

  return jwt.sign(
    { userId: _id, firstName, lastName, email, role },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
};

export const generateRefreshToken = async (user: IUser): Promise<string> => {
  const token = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

  // Save refresh token in the database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    userId: user._id,
    token,
    expiresAt,
  });

  return token;
};

export const verifyAccessToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

export const encryptJwtToken = (token: string): string => {
  const cipher = createCipheriv(
    encryptionType,
    Buffer.from(encryptionKey, "hex"),
    Buffer.from(encryptionIv, "hex")
  );
  let encrypted = cipher.update(token);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
};

export const decryptJwtToken = (token: string): string => {
  const decipher = createDecipheriv(
    encryptionType,
    Buffer.from(encryptionKey, "hex"),
    Buffer.from(encryptionIv, "hex")
  );

  let decrypted = decipher.update(token, "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
};
