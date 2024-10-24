import mongoose, { model, Schema } from "mongoose";

// Declare the Schema of the Mongo model
/*Collection Name */
const COLLECTION_NAME = "products";
const DOCUMENT_NAME = "product";
interface IProduct {
  product_name: string;
  product_thumb: string;
  product_description: string;
  product_price: number;
  product_type: string;
  product_shop: Schema.Types.ObjectId;
  product_attributes: any;
}
const productSchema = new Schema<IProduct>(
  {
    product_name: {
      type: String,
      require: true,
    },
    product_thumb: {
      type: String,
      require: true,
    },
    product_description: {
      type: String,
    },
    product_price: {
      type: Number,
      require: true,
    },
    product_type: {
      type: String,
      require: true,
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      require: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

interface IClothing {
  brand: string;
  size: string;
  material: string;
}

const clothingSchema = new Schema<IClothing>(
  {
    brand: {
      type: String,
      require: true,
    },
    size: String,
    material: String,
  },
  {
    timestamps: true,
    collection: "clothings",
  }
);

interface IElectronic {
  manufacturer: string;
  model: string;
  color: string;
}

const electronicSchema = new Schema<IElectronic>(
  {
    manufacturer: {
      type: String,
      require: true,
    },
    model: String,
    color: String,
  },
  {
    timestamps: true,
    collection: "electronics",
  }
);
//Export the model
const Product = model<IProduct>(DOCUMENT_NAME, productSchema);
const Clothing = model<IClothing>("clothing", clothingSchema);
const Electronic = model<IElectronic>("electronic", electronicSchema);

export { Product, Clothing, Electronic, IProduct, IClothing, IElectronic };
