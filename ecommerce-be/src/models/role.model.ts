import mongoose, { Schema } from "mongoose";

const COLLECTION_NAME = "roles";
const DOCUMENT_NAME = "role";

interface IRole {
  role_name: string;
  role_slug: string;
  role_description: string;
  role_grants: any;
}

const RoleSchema = new Schema<IRole>(
  {
    role_name: {
      type: String,
      required: true,
      unique: true,
    },
    role_slug: {
      type: String,
      required: true,
      unique: true,
    },
    role_description: {
      type: String,
      required: true,
    },
    role_grants: [
      {
        resource: {
          type: Schema.Types.ObjectId,
          ref: "Resource",
          required: true,
        },
        action: { type: [String], required: true },
        attributes: { type: String, default: "*" },
        _id: false,
      },
    ],
  },

  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
const Role = mongoose.model<IRole>(DOCUMENT_NAME, RoleSchema);

export { Role, IRole };
