import { StatusCodes } from "http-status-codes";
import ErrorResponse from "../core/error.response";
import {
  IProduct,
  Product as ProductMongo,
  Clothing as ClothingMongo,
  Electronic as ElectronicMongo,
} from "../models/product.model";
//config product factory

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
    console.log(this.productRegistry);
    const productTypeClass = this.productRegistry[product_type];
    if (!productTypeClass) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Invalid product type");
    }
    return new productTypeClass(product, product_shop).createProduct();
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
