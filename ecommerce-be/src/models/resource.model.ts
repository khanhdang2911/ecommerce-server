import mongoose, { Schema } from "mongoose";

const COLLECTION_NAME = "resources";
const DOCUMENT_NAME = "resource";

interface IResource {
  src_name: string;
  src_slug: string;
  src_description: string;
}

const ResourceSchema = new Schema<IResource>(
  {
    src_name: {
      type: String,
      required: true,
      unique: true,
    },
    src_slug: {
      type: String,
      required: true,
      unique: true,
    },
    src_description: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
const Resource = mongoose.model<IResource>(DOCUMENT_NAME, ResourceSchema);

export { Resource, IResource };
