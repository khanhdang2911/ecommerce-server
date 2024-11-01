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
interface productInCart {
  product_id: string;
  product_quantity: number;
}
const CartSchema = new Schema<ICart>(
  {
    cart_state: {
      type: String,
      required: true,
      default: CART_STATE.active,
      enum: [...Object.keys(CART_STATE)],
    },
    cart_products: {
      type: [],
      default: [],
    },
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

const Cart = mongoose.model<ICart>(DOCUMENT_NAME, CartSchema);

export { Cart, ICart, productInCart };
