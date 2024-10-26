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

const findAllDraft = async (req: Request, res: Response) => {
  const product_shop = req.shop?._id;
  // const limit = parseInt(req.query.limit as string);
  // const skip = parseInt(req.query.skip as string);
  const allDraft = await ProductFactory.findAllDraft(product_shop);
  new SuccessResponse(
    StatusCodes.OK,
    "Get all draft products successfully!",
    allDraft
  ).send(res);
};

const findAllPublished = async (req: Request, res: Response) => {
  const product_shop = req.shop?._id;
  console.log(product_shop);
  if (!product_shop) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Missing required fields");
  }
  const allPublished = await ProductFactory.findAllPublished(product_shop);
  new SuccessResponse(
    StatusCodes.OK,
    "Get all published products successfully!",
    allPublished
  ).send(res);
};

const publishProduct = async (req: Request, res: Response) => {
  const product_shop = req.shop?._id;
  const product_id = req.params.id;
  if (!product_shop) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Missing required fields");
  }
  const updateProduct = await ProductFactory.publishProduct(
    product_shop,
    product_id
  );
  new SuccessResponse(
    StatusCodes.OK,
    "Product published successfully!",
    updateProduct
  ).send(res);
};
const unPublishProduct = async (req: Request, res: Response) => {
  const product_shop = req.shop?._id;
  const product_id = req.params.id;
  if (!product_shop) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Missing required fields");
  }
  const updateProduct = await ProductFactory.unPublishProduct(
    product_shop,
    product_id
  );
  new SuccessResponse(
    StatusCodes.OK,
    "Product unpublished successfully!",
    updateProduct
  ).send(res);
};

const searchProduct = async (req: Request, res: Response) => {
  const keyword = req.query.keyword;
  const limit = parseInt(req.query.limit as string);
  const page = parseInt(req.query.page as string);
  const sort = req.query.sort;
  const filter = req.body;
  if (!keyword) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Missing required fields");
  }
  const searchResult = await ProductFactory.searchProduct(
    keyword as string,
    limit,
    page,
    sort as string,
    filter
  );
  new SuccessResponse(
    StatusCodes.OK,
    "Search product sucessfully",
    searchResult
  ).send(res);
};

const findProductDetail = async (req: Request, res: Response) => {
  const product_id = req.params.id;
  if (!product_id) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Missing required fields");
  }
  const productDetail = await ProductFactory.findProductDetail(product_id);
  new SuccessResponse(
    StatusCodes.OK,
    "Get product detail successfully",
    productDetail
  ).send(res);
};
export {
  createProduct,
  findAllDraft,
  findAllPublished,
  publishProduct,
  unPublishProduct,
  searchProduct,
  findProductDetail,
};
