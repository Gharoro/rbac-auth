import { Request, Response } from "express";
import { apiResponse, handleError } from "../utils/apiResponse";

export class CarrierController {
  static async carrier(req: Request, res: Response): Promise<any> {
    try {
      return res
        .status(200)
        .json(apiResponse(true, "Welcome Carrier!", req.user));
    } catch (err) {
      handleError(res, err);
      return;
    }
  }
}
