import { Comment, IComment } from "../models/comment.model";

const updateManyComment = async (filter: object, update: object) => {
  await Comment.updateMany(filter, update);
};

export { updateManyComment };