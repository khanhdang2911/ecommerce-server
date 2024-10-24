import { Request, Response } from "express";
import { ProductFactory } from "../services/product.service";
import SuccessResponse from "../core/success.response";
import { StatusCodes } from "http-status-codes";
import ErrorResponse from "../core/error.response";
const createProduct = async (req: Request, res: Response) => {
  const product_type = req.body.product_type;
  const product = req.body;
  const product_shop = req.shop?._id;
  if (!product_type || !product || !product_shop) {
    console.log(product_type, product, product_shop);
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Missing required fields");
  }
  const newProduct = await ProductFactory.createProduct(
    product,
    product_shop,
    product_type
  );
  new SuccessResponse(
    StatusCodes.CREATED,
    "Product created successfully",
    newProduct
  ).send(res);
};

export { createProduct };
