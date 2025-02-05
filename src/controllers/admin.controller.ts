import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";
import { apiResponse, handleError } from "../utils/apiResponse";

export class AdminController {
  // Get Logged In Admin Details
  static async admin(req: Request, res: Response): Promise<any> {
    try {
      return res
        .status(200)
        .json(apiResponse(true, "Welcome Admin!", req.user));
    } catch (err) {
      handleError(res, err);
      return;
    }
  }

  // Fetch All Users
  static async users(req: Request, res: Response): Promise<any> {
    try {
      const users = await AdminService.fetchUsers();
      return res
        .status(200)
        .json(apiResponse(true, "Fetched users", { users }));
    } catch (err) {
      handleError(res, err);
      return;
    }
  }
}
