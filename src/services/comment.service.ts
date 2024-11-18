import { StatusCodes } from "http-status-codes";
import ErrorResponse from "../core/error.response";
import { createCommentValidation } from "../validations/comment.validation";
import * as commentRepo from "../repositories/comment.repo";
import { Comment, IComment } from "../models/comment.model";

const createCommentService = async (userId: any, commentData: IComment) => {
  const { error } = await createCommentValidation(commentData);
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, error.message);
  }
  const newComment = await Comment.create({
    ...commentData,
    comment_userId: userId,
  });
  const parentId = commentData.comment_parentId;
  if (parentId) {
    const parentRight = await Comment.findOne({
      comment_userId: userId,
      comment_productId: commentData.comment_productId,
      _id: parentId,
    }).select("comment_right");
    if (!parentRight) {
      throw new ErrorResponse(
        StatusCodes.NOT_FOUND,
        "Parent comment not found"
      );
    }

    const rightValue = parentRight.comment_right;
    newComment.comment_left = rightValue;
    newComment.comment_right = rightValue + 1;

    //Update all comments right value
    await commentRepo.updateManyComment(
      {
        comment_userId: userId,
        comment_productId: commentData.comment_productId,
        comment_right: { $gte: rightValue },
      },
      {
        $inc: { comment_right: 2 },
      }
    );
    //Update all comments left value
    await commentRepo.updateManyComment(
      {
        comment_userId: userId,
        comment_productId: commentData.comment_productId,
        comment_left: { $gt: newComment.comment_right },
      },
      {
        $inc: { comment_left: 2 },
      }
    );
  } else {
    newComment.comment_left = 1;
    newComment.comment_right = 2;
  }
  await newComment.save();
  return newComment;
};


const createCommentTree = (comments) => {
  const commentsMap: { [key: string]: any } = {};
  const commentsTree: any = [];
  comments.forEach((comment: any) => {
    commentsMap[comment._id] = { ...comment.toObject(), children: [] };
  });
  comments.forEach((comment: any) => {
    if (comment.comment_parentId) {
      const parent = commentsMap[comment.comment_parentId];
      if (parent) {
        parent.children.push(commentsMap[comment._id]);
      }
    } else {
      commentsTree.push(commentsMap[comment._id]);
    }
  });
  return commentsTree;
};

const getCommentsByProductService = async (productId: string) => {
  const comments = await Comment.find({ comment_productId: productId });
  return createCommentTree(comments);
};

export {
  createCommentService,
  getCommentsService,
  getCommentsByProductService,
};
