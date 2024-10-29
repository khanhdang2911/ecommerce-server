import * as discountService from "../services/discount.service";
import { IDiscount } from "../models/discount.model";

import SuccessResponse from "../core/success.response";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import ErrorResponse from "../core/error.response";
const createDiscount = async (req: Request, res: Response) => {
  const discountInfo = req.body;
  const shopId = req.shop?._id;
  const newDiscount = await discountService.createDiscount(
    discountInfo as any as IDiscount,
    shopId
  );
  console.log("newDiscount", newDiscount);
  new SuccessResponse(
    StatusCodes.CREATED,
    "Discount created successfully",
    newDiscount
  ).send(res);
};

const updateDiscount = async (req: Request, res: Response) => {
  const discountInfo = req.body;
  const shopId = req.shop?._id;
  const discountId = req.params.discountId;
  const updatedDiscount = await discountService.updateDiscount(
    discountInfo as any as IDiscount,
    shopId,
    discountId as any
  );
  new SuccessResponse(
    StatusCodes.OK,
    "Discount updated successfully",
    updatedDiscount
  ).send(res);
};

const getDiscountsByProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  if (!productId) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Product id is required");
  }
  const results = await discountService.getDiscountsByProduct(productId as any);
  new SuccessResponse(
    StatusCodes.OK,
    "Discounts fetched successfully",
    results
  ).send(res);
};
export { createDiscount, updateDiscount, getDiscountsByProduct };
