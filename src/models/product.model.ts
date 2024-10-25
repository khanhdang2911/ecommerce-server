import { model, Schema } from "mongoose";
import slugify from "slugify";
// Declare the Schema of the Mongo model
/*Collection Name */
const COLLECTION_NAME = "products";
const DOCUMENT_NAME = "product";
interface IProduct {
  product_name: string;
  product_thumb: string;
  product_description: string;
  product_price: number;
  product_slug: string;
  product_type: string;
  product_shop: Schema.Types.ObjectId;
  product_attributes: any;
  //more
  product_ratingAvg?: number;
  product_variations?: any;
  isDraft?: boolean;
  isPublished?: boolean;
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
    product_slug: {
      type: String,
      require: true,
    },
    product_type: {
      type: String,
      require: true,
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "shop",
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      require: true,
    },
    //more
    product_ratingAvg: {
      type: Number,
      default: 4.5,
      min: [0, "Rating must be greater than 0"],
      max: [5, "Rating must be less than 5"],
      set: (value: number) => Math.round(value * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
//Index
productSchema.index({ product_name: "text", product_description: "text" });
//Index end
//middleware start
productSchema.pre("save", function (next) {
  console.log("Product middleware");
  console.log(this.product_name);
  console.log(slugify(this.product_name, { lower: true }));
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});
//middleware end
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
