import mongoose, { Schema } from "mongoose";
import { ORDER_STATUS } from "../constants/order.constant";

const COLLECTION_NAME = "orders";
const DOCUMENT_NAME = "order";

interface IOrder {
  order_userId: Schema.Types.ObjectId;
  order_checkout: object;
  order_shipping: object;
  order_payment: object;
  order_products_discounts: Array<object>;
  order_status: string;
}
/*
  checkout{
    "totalPrice": 2771,
    "totalFee": 0,
    "totalOrder": 2771
  }
    shipping{
        "shipping_street": "1234",
        "shipping_city": "HCM",
        "shipping_country": "Vietnam",
    }
 */
const OrderSchema = new Schema<IOrder>(
  {
    order_userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    order_checkout: {
      type: Object,
      required: true,
    },
    order_shipping: {
      type: Object,
      required: true,
    },
    order_payment: {
      type: Object,
      required: true,
      default: {},
    },
    order_products_discounts: {
      type: [Object],
      required: true,
    },
    order_status: {
      type: String,
      required: true,
      enum: [...Object.values(ORDER_STATUS)],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
const Order = mongoose.model<IOrder>(DOCUMENT_NAME, OrderSchema);

export { Order, IOrder };
