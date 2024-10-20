import mongoose, { Schema } from "mongoose";

const COLLECTION_NAME = "keyTokens";
const DOCUMENT_NAME = "keyToken";

interface IKeyToken {
  user: Schema.Types.ObjectId;
  privateKey: string;
  publicKey: string;
  refreshToken: string;
}
const KeyTokenSchema = new Schema<IKeyToken>(
  {
    user: {
      type: Schema.Types.ObjectId,
      trim: true,
      ref: "shop",
    },
    privateKey: {
      type: String,
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const KeyToken = mongoose.model<IKeyToken>(DOCUMENT_NAME, KeyTokenSchema);

export { KeyToken, IKeyToken };
