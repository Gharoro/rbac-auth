import { UserRole } from "./enum";
import { IUser } from "./interface";

declare module "express" {
  interface Request {
    user?: IUser;
  }
}
