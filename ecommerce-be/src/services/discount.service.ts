import { StatusCodes } from "http-status-codes";
import ErrorResponse from "../core/error.response";
import { Discount, IDiscount } from "../models/discount.model";
import { Schema } from "mongoose";
import { Product as ProductMongo } from "../models/product.model";
import {
  DISCOUNT_APPLY_TYPE,
  DISCOUNT_TYPE,
} from "../constants/discount.constant";
import {
  cancelDiscountValidation,
  discountCreateValidation,
  discountUpdateValidation,
  verifyDiscountCodeValidation,
} from "../validations/discount.validation";
import * as discountRepo from "../repositories/discount.repo";
import { nestedObjectNoUndefined } from "../utils";
import * as productRepo from "../repositories/product.repo";
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
    discount_isActive: true,
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
    discount_isActive: true,
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
  const updateDiscount = await discountRepo.findOneAndUpdate(
    {
      _id: discountId,
      discount_shopId: shopId,
      discount_isActive: true,
    },
    {
      ...nestedObjectNoUndefined(discountInfo),
    },
    true
  );
  if (!updateDiscount) {
    throw new ErrorResponse(StatusCodes.NOT_FOUND, "Update discount failed");
  }
  return updateDiscount;
};

//getDiscountsByProduct
const getDiscountsByProduct = async (productId: Schema.Types.ObjectId) => {
  const discounts = await discountRepo.findByFilter(
    {
      discount_specific_products: productId,
      discount_isActive: true,
    },
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

const getAllProductByDiscount = async (discountId: Schema.Types.ObjectId) => {
  const discount = await discountRepo.findOne({
    _id: discountId,
    discount_isActive: true,
  });
  if (!discount) {
    throw new ErrorResponse(StatusCodes.NOT_FOUND, "Discount not found");
  }
  let products;
  if (discount.discount_apply_to === DISCOUNT_APPLY_TYPE.all) {
    products = await productRepo.findAllProduct(
      {
        isPublished: true,
        product_shop: discount.discount_shopId,
      },
      ["product_name", "product_thumb", "product_description"]
    );
  } else if (discount.discount_apply_to === DISCOUNT_APPLY_TYPE.specific) {
    products = await productRepo.findAllProduct(
      {
        isPublished: true,
        _id: { $in: discount.discount_specific_products },
      },
      ["product_name", "product_thumb", "product_description"]
    );
  }
  return products;
};
const getAllDiscountsOfShop = async (shopId: Schema.Types.ObjectId) => {
  const discounts = await discountRepo.findByFilterUnSelect(
    {
      discount_shopId: shopId,
      discount_isActive: true,
    },
    ["__v", "discount_specific_products", "createdAt", "updatedAt"]
  );
  return discounts;
};

const verifyDiscountCode = async (verifyDiscount: any, userId: any) => {
  const { error } = await verifyDiscountCodeValidation(verifyDiscount);
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, error.message);
  }
  const { discount_code, discount_shopId, products } = verifyDiscount;
  const discount = await discountRepo.findOne({
    discount_code,
  });
  if (!discount) {
    throw new ErrorResponse(StatusCodes.NOT_FOUND, "Discount code not found");
  }
  //check if discount is active
  if (
    discount.discount_shopId.toString() !== discount_shopId ||
    !discount.discount_isActive
  ) {
    throw new ErrorResponse(StatusCodes.FORBIDDEN, "Discount code not allowed");
  }
  //check if discount is expired
  const currentDate = new Date();
  if (currentDate > discount.discount_end_date) {
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      "Discount code is expired"
    );
  }
  //check if discount_userd_count is less than discount_apply_count
  if (discount.discount_used_count >= discount.discount_apply_count) {
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      "Discount code is expired"
    );
  }
  //check how many times user used the discount

  const userUsedDiscount = discount.discount_user_used.filter((id: any) => {
    return id.toString() === userId.toString();
  });
  if (userUsedDiscount.length >= discount.discount_max_uses_per_user) {
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      "You have reached the maximum usage"
    );
  }
  //check if discount is applicable to the products
  products.forEach((product: any) => {
    if (
      !discount.discount_specific_products.some((id: any) => {
        return id.toString() === product.product_id;
      })
    ) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Some products are not applicable for discount"
      );
    }
  });
  const checkProducts = await productRepo.findAllProduct({
    _id: { $in: products.map((product: any) => product.product_id) },
    product_shop: discount_shopId,
  });
  if (checkProducts.length !== products.length) {
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      "Some products are not applicable for discount"
    );
  }
  //Tinh discount value
  const totalOrderValue = products.reduce((acc: any, product: any) => {
    const productPrice = checkProducts.find(
      (p: any) => p._id.toString() === product.product_id
    ); // check lai gia cho chac an
    return acc + productPrice?.product_price! * product.product_quantity;
  }, 0);
  //check min value
  if (totalOrderValue < discount.discount_min_order_value) {
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      "Order value is not enough"
    );
  }
  let discountValue =
    discount.discount_type === DISCOUNT_TYPE.percentage
      ? totalOrderValue * (discount.discount_value / 100)
      : totalOrderValue - discount.discount_value;
  let totalPrice = totalOrderValue - discountValue;
  //update
  await discountRepo.findByIdAndUpdate(discount._id as any, {
    $push: { discount_user_used: userId },
    $inc: { discount_used_count: 1 },
  });
  if (totalPrice < 0) {
    discountValue = totalOrderValue;
    totalPrice = 0;
  }
  return {
    totalOrderValue,
    discountValue,
    totalPrice,
  };
};

const deleteDiscount = async (
  discountId: Schema.Types.ObjectId,
  shopId: Schema.Types.ObjectId
) => {
  await discountRepo.deleteOne({
    _id: discountId,
    discount_shopId: shopId,
    discount_isActive: true,
  });
};

const cancelDiscount = async (body: any, userId: any) => {
  const { discount_code, discount_shopId } = body;
  const { error } = await cancelDiscountValidation(body);
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, error.message);
  }
  const discount = await discountRepo.findOne({
    discount_code,
    discount_shopId,
  });
  if (!discount || !discount.discount_isActive) {
    throw new ErrorResponse(StatusCodes.NOT_FOUND, "Discount not found");
  }
  //check if user is in discount_user_used
  const userUsedDiscount = discount.discount_user_used.find((id: any) => {
    return id.toString() === userId.toString();
  });
  if (!userUsedDiscount) {
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      "You have not used this discount yet"
    );
  }
  //update
  const result = await discountRepo.findByIdAndUpdate(discount._id as any, {
    $pull: { discount_user_used: userId },
    $inc: { discount_used_count: -1 },
  });
  return result;
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
