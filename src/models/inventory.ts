import mongoose, { Schema } from "mongoose";

const COLLECTION_NAME = "inventory";
const DOCUMENT_NAME = "inventories";

interface IInventory {
  inven_product_id: Schema.Types.ObjectId;
  inven_location: string;
  inven_stock: number;
  inven_shopId: Schema.Types.ObjectId;
  inven_reservations: Array<any>;
}

const InventorySchema = new Schema<IInventory>(
  {
    inven_product_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    inven_location: {
      type: String,
      default: "unKnown",
    },
    inven_stock: {
      type: Number,
      required: true,
    },
    inven_shopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    inven_reservations: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
const Inventory = mongoose.model<IInventory>(DOCUMENT_NAME, InventorySchema);

export { Inventory, IInventory };
