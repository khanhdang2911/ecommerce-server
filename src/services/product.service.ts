import { StatusCodes } from "http-status-codes";
import ErrorResponse from "../core/error.response";
import {
  IProduct,
  Product as ProductMongo,
  Clothing as ClothingMongo,
  Electronic as ElectronicMongo,
} from "../models/product.model";
import * as productRepo from "../repositories/product.repo";
import { nestedObjectNoUndefined } from "../utils";
import { inventoryInsert } from "./inventory.service";
import { Schema } from "mongoose";

class ProductFactory {
  static productRegistry: any = {};
  static registerProduct(product_type: string, classRef: any) {
    this.productRegistry[product_type] = classRef;
  }
  static createProduct(
    product: IProduct,
    product_shop: string,
    product_type: string
  ) {
    const productTypeClass = this.productRegistry[product_type];
    if (!productTypeClass) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Invalid product type");
    }
    return new productTypeClass(product, product_shop).createProduct();
  }
  static updateProduct = async (
    newProduct: any,
    product_id: string,
    product_type: string,
    product_shop: string
  ) => {
    const productTypeClass = this.productRegistry[product_type];
    if (!productTypeClass) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Invalid product type");
    }
    const updateProduct = await new productTypeClass(
      newProduct,
      product_shop
    ).updateProduct(product_id);
    if (!updateProduct) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Error when update product"
      );
    }
    return updateProduct;
  };
  static async findAllDraft(
    product_shop: string,
    limit: number = 50,
    skip: number = 0
  ) {
    const allDraft = await productRepo.findAllDraft(product_shop, limit, skip);
    if (!allDraft)
      throw new ErrorResponse(
        StatusCodes.NOT_FOUND,
        "Not found any draft product"
      );
    return allDraft;
  }
  static findAllPublished = async (
    product_shop: string,
    limit: number = 50,
    skip: number = 0
  ) => {
    const allPublished = await productRepo.findAllPublished(
      product_shop,
      limit,
      skip
    );
    if (!allPublished) {
      throw new ErrorResponse(
        StatusCodes.NOT_FOUND,
        "Not found any published product"
      );
    }
    return allPublished;
  };
  static publishProduct = async (product_shop: string, product_id: string) => {
    const updateProduct = await productRepo.publishProduct(
      product_shop,
      product_id
    );
    if (!updateProduct) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Error when publish product"
      );
    }
    return updateProduct;
  };
  static unPublishProduct = async (
    product_shop: string,
    product_id: string
  ) => {
    const updateProduct = await productRepo.unPublishProduct(
      product_shop,
      product_id
    );
    if (!updateProduct) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Error when unpublish product"
      );
    }
    return updateProduct;
  };
  //for user
  static searchProduct = async (
    keyword: string,
    limit: number = 50,
    page: number = 1,
    sort: string = "ctime",
    filter: object = {}
  ) => {
    const searchResult = await productRepo.searchProduct(
      keyword,
      limit,
      page,
      sort,
      filter,
      ["product_name", "product_price", "product_thumb", "product_ratingAvg"]
    );
    return searchResult;
  };
  static findProductDetail = async (product_id: string) => {
    const productDetail = await productRepo.findProductDetail(
      {
        _id: product_id,
      },
      ["__v"]
    );
    if (!productDetail) {
      throw new ErrorResponse(StatusCodes.NOT_FOUND, "Product not found");
    }
    return productDetail;
  };
}

class Product {
  constructor(
    public product: IProduct,
    public product_shop: Schema.Types.ObjectId
  ) {}
  async createProduct(id?: any) {
    const newProduct = await ProductMongo.create({
      ...this.product,
      product_shop: this.product_shop,
      _id: id,
    });
    if (!newProduct) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Error when created product"
      );
    }
    //create inventory
    await inventoryInsert({
      inven_product_id: newProduct._id as any,
      inven_location: "unKnown",
      inven_stock: this.product.product_quantity,
      inven_shopId: this.product_shop,
      inven_reservations: [],
    });
    return newProduct;
  }
  async updateProduct(product_id: string) {
    const updateProduct = await productRepo.updateProductById(
      nestedObjectNoUndefined(this.product),
      product_id,
      ProductMongo
    );
    return updateProduct;
  }
}

class Clothing extends Product {
  constructor(
    public product: IProduct,
    public product_shop: Schema.Types.ObjectId
  ) {
    super(product, product_shop);
  }
  async createProduct() {
    const clothingProduct = await ClothingMongo.create({
      ...this.product.product_attributes,
    });
    if (!clothingProduct) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Error when created clothing product"
      );
    }
    const newProduct = await super.createProduct(clothingProduct._id);
    if (!newProduct) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Error when created product"
      );
    }
    return newProduct;
  }
  async updateProduct(product_id: string) {
    await productRepo.updateProductById(
      nestedObjectNoUndefined(this.product.product_attributes),
      product_id,
      ClothingMongo
    );
    const updateProduct = await super.updateProduct(product_id);
    return updateProduct;
  }
}

class Electronic extends Product {
  constructor(
    public product: IProduct,
    public product_shop: Schema.Types.ObjectId
  ) {
    super(product, product_shop);
  }
  async createProduct() {
    const electronicProduct = await ElectronicMongo.create({
      ...this.product.product_attributes,
    });
    if (!electronicProduct) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Error when created clothing product"
      );
    }
    const newProduct = await super.createProduct(electronicProduct._id);
    if (!newProduct) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Error when created product"
      );
    }
    return newProduct;
  }
  async updateProduct(product_id: string) {
    await productRepo.updateProductById(
      nestedObjectNoUndefined(this.product.product_attributes),
      product_id,
      ElectronicMongo
    );
    const updateProduct = await super.updateProduct(product_id);
    return updateProduct;
  }
}
//register product types
const productTypes = [
  { name: "Electronic", classRef: Electronic },
  { name: "Clothing", classRef: Clothing },
];

productTypes.forEach((productType) => {
  ProductFactory.registerProduct(productType.name, productType.classRef);
});
//export module
export { ProductFactory, Clothing, Electronic };
