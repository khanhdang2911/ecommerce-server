import { StatusCodes } from "http-status-codes";
import ErrorResponse from "../core/error.response";
import { Discount, IDiscount } from "../models/discount.model";
import { Schema } from "mongoose";
import { Product as ProductMongo } from "../models/product.model";
import { DISCOUNT_APPLY_TYPE } from "../constants/discount.constant";
import {
  discountCreateValidation,
  discountUpdateValidation,
} from "../validations/discount.validation";
import * as discountRepo from "../repositories/discount.repo";
import { convertToObjectMongo, nestedObjectNoUndefined } from "../utils";

const createDiscount = async (
  discountInfo: IDiscount,
  shopId: Schema.Types.ObjectId
) => {
  const { error } = await discountCreateValidation(discountInfo);
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, error.message);
  }
  //check if discount code already exists
  const discountCodeExists = await discountRepo.findOne({
    discount_code: discountInfo.discount_code,
    discount_shopId: shopId,
  });
  if (discountCodeExists) {
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      "Discount code already exists"
    );
  }
  //check if discount apply count is greater than 0
  if (discountInfo.discount_apply_to === DISCOUNT_APPLY_TYPE.all) {
    discountInfo.discount_specific_products = [];
  } else if (discountInfo.discount_apply_to === DISCOUNT_APPLY_TYPE.specific) {
    if (!discountInfo.discount_specific_products?.length) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Specific products are required"
      );
    }
    //check if products is not belong to the shop
    const products = await ProductMongo.find({
      _id: { $in: discountInfo.discount_specific_products },
      product_shop: shopId,
    });
    if (products.length !== discountInfo.discount_specific_products.length) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Some products do not belong to the shop"
      );
    }
  }

  const newDiscount = await Discount.create({
    ...discountInfo,
    discount_shopId: shopId,
  });
  return newDiscount;
};

const updateDiscount = async (
  discountInfo: IDiscount,
  shopId: Schema.Types.ObjectId,
  discountId: Schema.Types.ObjectId
) => {
  const { error } = await discountUpdateValidation(discountInfo);
  if (error) {
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      error.message.replace(/"/g, "")
    );
  }
  //check if discount code already exists
  const discountCodeExists = await discountRepo.findOne({
    discount_code: discountInfo.discount_code,
    discount_shopId: shopId,
  });
  if (discountCodeExists) {
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      "Discount code already exists"
    );
  }
  //check if discount apply count is greater than 0
  if (discountInfo.discount_apply_to === DISCOUNT_APPLY_TYPE.all) {
    discountInfo.discount_specific_products = [];
  } else if (discountInfo.discount_apply_to === DISCOUNT_APPLY_TYPE.specific) {
    if (!discountInfo.discount_specific_products?.length) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Specific products are required"
      );
    }
    //check if products is not belong to the shop
    const products = await discountRepo.findByFilter({
      _id: { $in: discountInfo.discount_specific_products },
      product_shop: shopId,
    });
    if (products.length !== discountInfo.discount_specific_products.length) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Some products do not belong to the shop"
      );
    }
  }
  const updateDiscount = await Discount.findOneAndUpdate(
    {
      _id: discountId,
      discount_shopId: shopId,
    },
    {
      ...nestedObjectNoUndefined(discountInfo),
    },
    {
      new: true,
    }
  );
  if (!updateDiscount) {
    throw new ErrorResponse(StatusCodes.NOT_FOUND, "Update discount failed");
  }
  return updateDiscount;
};

//getDiscountsByProduct
const getDiscountsByProduct = async (
  productId: Schema.Types.ObjectId,
  limit: number = 50,
  page: number = 1
) => {
  const discounts = await discountRepo.findByFilter(
    {
      discount_specific_products: productId,
    },
    limit,
    page,
    [
      "discount_name",
      "discount_description",
      "discount_value",
      "discount_code",
      "discount_isActive",
    ]
  );
  return discounts;
};
export { createDiscount, updateDiscount, getDiscountsByProduct };
