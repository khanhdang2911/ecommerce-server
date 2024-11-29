import mongoose, { Schema } from "mongoose";

const COLLECTION_NAME = "apiKeys";
const DOCUMENT_NAME = "apiKey";

interface IApiKey {
  key: string;
  status: boolean;
  permissions: string[];
}

const ApiKeySchema = new Schema<IApiKey>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["0000", "1111", "2222"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
const ApiKey = mongoose.model<IApiKey>(DOCUMENT_NAME, ApiKeySchema);

export { ApiKey, IApiKey };
