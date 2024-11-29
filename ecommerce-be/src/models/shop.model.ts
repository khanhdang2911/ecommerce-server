import mongoose, { Schema } from "mongoose";

const COLLECTION_NAME = "shops";
const DOCUMENT_NAME = "shop";

interface IShop {
  name: string;
  email: string;
  password: string;
  status: string;
  verify: boolean;
  roles: Array<string>;
}
const shopSchema = new Schema<IShop>(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const Shop = mongoose.model<IShop>(DOCUMENT_NAME, shopSchema);

export { Shop, IShop };
