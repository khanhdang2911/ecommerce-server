import { Types } from "mongoose";
import { Product as ProductMongo } from "../models/product.model";
import { unSelectData } from "../utils";
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
  filter: Object,
  select: Array<string>
) => {
  console.log(filter);
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
    .select(select)
    .lean();
  return products;
};

const findProductDetail = async (product_id: string, select: Array<string>) => {
  const product = await ProductMongo.findOne({
    _id: product_id,
    isPublished: true,
  })
    .select(unSelectData(select))
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

export {
  findAllDraft,
  findAllPublished,
  publishProduct,
  unPublishProduct,
  searchProduct,
  findProductDetail,
  updateProductById,
};
