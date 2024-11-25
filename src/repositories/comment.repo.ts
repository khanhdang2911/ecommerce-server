import { Comment } from "../models/comment.model";

const updateManyComment = async (filter: object, update: object) => {
  await Comment.updateMany(filter, update);
};

const findOneComment = async (filter: object, select?: Array<string>) => {
  return await Comment.findOne(filter).select(select!);
};
export { updateManyComment, findOneComment };
