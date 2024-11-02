import mongoose, { Schema } from "mongoose";
import { CART_STATE } from "../constants/cart.constant";

const COLLECTION_NAME = "carts";
const DOCUMENT_NAME = "cart";

interface ICart {
  cart_state: string;
  cart_products: any[];
  cart_user: string;
  cart_products_count: number;
}
interface IProductInCart {
  product_id: string;
  product_quantity: number;
  product_old_quantity?: number;
}
const CartSchema = new Schema<ICart>(
  {
    cart_state: {
      type: String,
      required: true,
      default: CART_STATE.active,
      enum: [...Object.values(CART_STATE)],
    },
    cart_products: [
      {
        _id: false,
        product_id: { type: Schema.Types.ObjectId, ref: "product" },
        product_quantity: { type: Number, default: 1 },
      },
    ],
    cart_user: {
      type: String,
      required: true,
    },
    cart_products_count: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
//config
CartSchema.index({ cart_user: 1 });
//config end
const Cart = mongoose.model<ICart>(DOCUMENT_NAME, CartSchema);

export { Cart, ICart, IProductInCart };
