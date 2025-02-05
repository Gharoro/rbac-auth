import { Request, Response } from "express";
import { apiResponse, handleError } from "../utils/apiResponse";

export class ShipperController {
  static async shipper(req: Request, res: Response): Promise<any> {
    try {
      return res
        .status(200)
        .json(apiResponse(true, "Welcome Shipper!", req.user));
    } catch (err) {
      handleError(res, err);
      return;
    }
  }
}
