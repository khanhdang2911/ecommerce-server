import { StatusCodes } from "http-status-codes";
import ErrorResponse from "../core/error.response";
import {
  IProduct,
  Product as ProductMongo,
  Clothing as ClothingMongo,
  Electronic as ElectronicMongo,
} from "../models/product.model";

class ProductFactory {
  static createProduct(
    product: IProduct,
    product_shop: string,
    product_type: string
  ) {
    switch (product_type) {
      case "Clothing":
        return new Clothing(product, product_shop).createProduct();
      case "Electronic":
        return new Electronic(product, product_shop).createProduct();
      default:
        throw new ErrorResponse(
          StatusCodes.BAD_REQUEST,
          "Invalid product type"
        );
    }
  }
}

class Product {
  constructor(public product: IProduct, public product_shop: string) {}
  async createProduct(id?: any) {
    const product = await ProductMongo.create({
      ...this.product,
      product_shop: this.product_shop,
      _id: id,
    });
    if (!product) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Error when created product"
      );
    }
    return product;
  }
}

class Clothing extends Product {
  constructor(public product: IProduct, public product_shop: string) {
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
}

class Electronic extends Product {
  constructor(public product: IProduct, public product_shop: string) {
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
}

export { ProductFactory };
