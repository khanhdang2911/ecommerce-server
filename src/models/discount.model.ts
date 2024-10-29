import mongoose, { Schema } from "mongoose";

const COLLECTION_NAME = "discounts";
const DOCUMENT_NAME = "discount";

interface IDiscount {
  discount_name: string;
  discount_description: string;
  discount_type: string; //percentage or fixed
  discount_value: number;
  discount_code: string;
  discount_start_date: Date;
  discount_end_date: Date;
  discount_apply_count: number; //how many times this discount can be applied
  discount_used_count: number; //how many times this discount has been used
  discount_max_uses_per_user: number; //how many times this discount can be used by a single user
  discount_min_order_value: number; //minimum order value to apply this discount
  discount_shopId: Schema.Types.ObjectId;

  discount_isActive: boolean;
  discount_apply_to: string; //all or specific products
  discount_specific_products: Schema.Types.ObjectId[];
}

const DiscountSchema = new Schema<IDiscount>(
  {
    discount_name: {
      type: String,
      require: true,
    },
    discount_description: {
      type: String,
      require: true,
    },
    discount_type: {
      type: String,
      required: true,
      enum: ["percentage", "fixed"],
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_code: {
      type: String,
      required: true,
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    discount_apply_count: {
      type: Number,
      required: true,
      min: [1, "Discount apply count should be greater than 0"],
    },
    discount_used_count: {
      type: Number,
      required: true,
      default: 0,
    },
    discount_max_uses_per_user: {
      type: Number,
      required: true,
    },
    discount_min_order_value: {
      type: Number,
      required: true,
      min: [1, "Discount min order should be greater than 0"],
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: "shop",
      required: true,
    },
    discount_isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    discount_apply_to: {
      type: String,
      required: true,
    },
    discount_specific_products: {
      type: [Schema.Types.ObjectId],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
const Discount = mongoose.model<IDiscount>(DOCUMENT_NAME, DiscountSchema);

export { Discount, IDiscount };
