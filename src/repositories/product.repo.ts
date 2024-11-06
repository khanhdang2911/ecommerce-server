import { Types } from "mongoose";
import { Product as ProductMongo } from "../models/product.model";
import { unSelectData } from "../utils";
import ErrorResponse from "../core/error.response";
import { StatusCodes } from "http-status-codes";
const findAllDraft = async (
  product_shop: string,
  limit: number,
  skip: number
) => {
  const allDraft = await productQuery(
    {
      product_shop: new Types.ObjectId(product_shop),
      isDraft: true,
    },
    limit,
    skip
  );
  return allDraft;
};

const findAllPublished = async (
  product_shop: string,
  limit: number,
  skip: number
) => {
  const allPublished = await productQuery(
    {
      product_shop: new Types.ObjectId(product_shop),
      isPublished: true,
    },
    limit,
    skip
  );
  return allPublished;
};

const publishProduct = async (product_shop: string, product_id: string) => {
  const updateProduct = await ProductMongo.updateOne(
    {
      product_shop: new Types.ObjectId(product_shop),
      _id: new Types.ObjectId(product_id),
    },
    {
      $set: {
        isPublished: true,
        isDraft: false,
      },
    },
    { new: true }
  ).lean();
  return updateProduct;
};

const unPublishProduct = async (product_shop: string, product_id: string) => {
  const updateProduct = await ProductMongo.updateOne(
    {
      product_shop: new Types.ObjectId(product_shop),
      _id: new Types.ObjectId(product_id),
    },
    {
      $set: {
        isPublished: false,
        isDraft: true,
      },
    },
    { new: true }
  ).lean();
  return updateProduct;
};

const searchProduct = async (
  keyword: string,
  limit: number,
  page: number,
  sort: string,
  filter: object,
  select?: Array<string>
) => {
  const skip = (page - 1) * limit;
  const sortBy: { [key: string]: 1 | -1 } =
    sort === "ctime" ? { updatedAt: -1 } : { updatedAt: 1 };
  const products = await ProductMongo.find(
    {
      $text: { $search: keyword },
      ...filter,
      isPublished: true,
    },
    {
      score: { $meta: "textScore" },
    }
  )
    .skip(skip)
    .limit(limit)
    .sort({ score: { $meta: "textScore" } }, sortBy)
    .select(select!)
    .lean();
  return products;
};

const findAllProduct = async (
  filter: object,
  select?: Array<string>,
  limit: number = 10,
  page: number = 1,
  sort: string = "ctime"
) => {
  const skip = (page - 1) * limit;
  const sortBy: { [key: string]: 1 | -1 } =
    sort === "ctime" ? { updatedAt: -1 } : { updatedAt: 1 };
  const products = await ProductMongo.find({
    ...filter,
    isPublished: true,
  })
    .skip(skip)
    .limit(limit)
    .sort(sortBy)
    .select(select!)
    .lean();
  return products;
};

const findAllProductUnSelect = async (
  filter: object,
  unSelect?: Array<string>,
  limit: number = 10,
  page: number = 1,
  sort: string = "ctime"
) => {
  const skip = (page - 1) * limit;
  const sortBy: { [key: string]: 1 | -1 } =
    sort === "ctime" ? { updatedAt: -1 } : { updatedAt: 1 };
  const products = await ProductMongo.find({
    ...filter,
    isPublished: true,
  })
    .skip(skip)
    .limit(limit)
    .sort(sortBy)
    .select(unSelectData(unSelect!))
    .lean();
  return products;
};

const findProductDetail = async (filter: object, unSelect?: Array<string>) => {
  const product = await ProductMongo.findOne({
    ...filter,
    isPublished: true,
  })
    .select(unSelectData(unSelect!))
    .lean();
  return product;
};
const updateProductById = async (
  newProduct: any,
  product_id: string,
  classRef: any
) => {
  const updateProduct = await classRef
    .findOneAndUpdate(
      {
        _id: product_id,
      },
      newProduct,
      { new: true }
    )
    .lean();
  return updateProduct;
};
const productQuery = async (condition: any, limit: number, skip: number) => {
  const products = await ProductMongo.find(condition)
    .populate("product_shop", "name email")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  return products;
};

const checkProductBelongToShop = async (
  product_id: string,
  shop_id: string
) => {
  const product = await ProductMongo.findOne({
    _id: product_id,
    product_shop: shop_id,
  }).lean();
  if (!product) return false;
  return true;
};

const checkAndGetDataFromListProduct = async (productList: Array<any>) => {
  const products = await Promise.all(
    productList.map(async (product: any) => {
      const productInDb = await findProductDetail(
        {
          _id: product.product_id,
          product_shop: product.product_shop,
        },
        ["__v"]
      );
      if (!productInDb) {
        throw new ErrorResponse(
          StatusCodes.NOT_FOUND,
          "Product not found in cart"
        );
      }
      return {
        product_price: productInDb.product_price,
        product_id: productInDb._id.toString(),
        product_quantity: product.product_quantity,
        product_shop: productInDb.product_shop.toString(),
        product_name: productInDb.product_name,
        product_thumb: productInDb.product_thumb,
      };
    })
  );
  return products;
};

export {
  findAllDraft,
  findAllPublished,
  publishProduct,
  unPublishProduct,
  searchProduct,
  findProductDetail,
  updateProductById,
  findAllProduct,
  findAllProductUnSelect,
  checkProductBelongToShop,
  checkAndGetDataFromListProduct,
};
