import { StatusCodes } from "http-status-codes";
import SuccessResponse from "../core/success.response";
import * as checkoutService from "../services/checkout.service";
import { Request, Response } from "express";

const checkoutReview = async (req: Request, res: Response) => {
  const userId = req.shop?._id;
  const checkoutInfo = req.body;
  const result = await checkoutService.checkoutReviewService(
    userId,
    checkoutInfo
  );
  new SuccessResponse(
    StatusCodes.OK,
    "Get checkout review successfully",
    result
  ).send(res);
};

export { checkoutReview };
