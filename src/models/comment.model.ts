import mongoose, { Schema } from "mongoose";

const COLLECTION_NAME = "comments";
const DOCUMENT_NAME = "comment";

interface IComment {
  comment_productId: Schema.Types.ObjectId;
  comment_userId: Schema.Types.ObjectId;
  comment_content: string;
  comment_left: number;
  comment_right: number;
  comment_parentId: Schema.Types.ObjectId;
}

const CommentSchema = new Schema<IComment>(
  {
    comment_productId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    comment_userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    comment_content: {
      type: String,
      required: true,
    },
    comment_left: {
      type: Number,
    },
    comment_right: {
      type: Number,
    },
    comment_parentId: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
const Comment = mongoose.model<IComment>(DOCUMENT_NAME, CommentSchema);

export { Comment, IComment };
