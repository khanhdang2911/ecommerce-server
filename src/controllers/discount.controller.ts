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

const getAllProductByDiscount = async (req: Request, res: Response) => {
  const discountId = req.params.discountId;
  if (!discountId) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Discount id is required");
  }
  const results = await discountService.getAllProductByDiscount(
    discountId as any
  );
  new SuccessResponse(
    StatusCodes.OK,
    "Products fetched successfully",
    results
  ).send(res);
};

const getAllDiscountsOfShop = async (req: Request, res: Response) => {
  const shopId = req.params.shopId;
  const results = await discountService.getAllDiscountsOfShop(shopId as any);
  new SuccessResponse(
    StatusCodes.OK,
    "Discounts fetched successfully",
    results
  ).send(res);
};

const verifyDiscountCode = async (req: Request, res: Response) => {
  const verifyDiscount = req.body;
  const userId = req.shop?._id;
  const result = await discountService.verifyDiscountCode(
    verifyDiscount,
    userId
  );
  new SuccessResponse(StatusCodes.OK, "Discount code verified", result).send(
    res
  );
};

const deleteDiscount = async (req: Request, res: Response) => {
  const discountId = req.params.discountId;
  const shopId = req.shop?._id;
  await discountService.deleteDiscount(discountId as any, shopId);
  new SuccessResponse(StatusCodes.OK, "Discount deleted successfully").send(
    res
  );
};

const cancelDiscount = async (req: Request, res: Response) => {
  const userId = req.shop?._id;
  await discountService.cancelDiscount(req.body, userId);
  new SuccessResponse(StatusCodes.OK, "Discount cancelled successfully").send(
    res
  );
};
export {
  createDiscount,
  updateDiscount,
  getDiscountsByProduct,
  getAllProductByDiscount,
  getAllDiscountsOfShop,
  verifyDiscountCode,
  deleteDiscount,
  cancelDiscount,
};
