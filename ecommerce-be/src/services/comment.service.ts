import { StatusCodes } from "http-status-codes";
import ErrorResponse from "../core/error.response";
import {
  createCommentValidation,
  updateCommentValidation,
} from "../validations/comment.validation";
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
    const parentRight = await commentRepo.findOneComment(
      {
        _id: parentId,
        comment_productId: commentData.comment_productId,
        comment_userId: userId,
      },
      ["comment_right"]
    );
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
        comment_productId: commentData.comment_productId,
        comment_userId: userId,
        comment_right: { $gte: rightValue },
      },
      {
        $inc: { comment_right: 2 },
      }
    );
    //Update all comments left value
    await commentRepo.updateManyComment(
      {
        comment_productId: commentData.comment_productId,
        comment_userId: userId,
        comment_left: { $gte: newComment.comment_right },
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
  const comments = await Comment.find({
    comment_productId: productId,
  });
  return createCommentTree(comments);
};

const updateCommentService = async (
  userId: any,
  commentId: string,
  commentData: IComment
) => {
  const { error } = await updateCommentValidation(commentData);
  if (error) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, error.message);
  }
  const comment = await commentRepo.findOneComment({
    _id: commentId,
  });
  if (!comment) {
    throw new ErrorResponse(StatusCodes.NOT_FOUND, "Comment not found");
  }
  if (comment.comment_userId.toString() !== userId.toString()) {
    throw new ErrorResponse(
      StatusCodes.FORBIDDEN,
      "You are not allowed to update this comment"
    );
  }
  comment.comment_content = commentData.comment_content;
  await comment.save();
  return comment;
};

const deleteCommentService = async (userId: any, commentId: string) => {
  const comment = await commentRepo.findOneComment({
    _id: commentId,
  });
  if (!comment) {
    throw new ErrorResponse(StatusCodes.NOT_FOUND, "Comment not found");
  }
  if (comment.comment_userId.toString() !== userId.toString()) {
    throw new ErrorResponse(
      StatusCodes.FORBIDDEN,
      "You are not allowed to delete this comment"
    );
  }
  await Comment.deleteMany({
    comment_productId: comment.comment_productId,
    comment_left: { $gte: comment.comment_left },
    comment_right: { $lte: comment.comment_right },
  });
  const substractValue = comment.comment_right - comment.comment_left + 1;
  await commentRepo.updateManyComment(
    {
      comment_productId: comment.comment_productId,
      comment_left: { $gt: comment.comment_right },
    },
    {
      $inc: {
        comment_left: -substractValue,
      },
    }
  );
  await commentRepo.updateManyComment(
    {
      comment_productId: comment.comment_productId,
      comment_right: { $gt: comment.comment_right },
    },
    {
      $inc: { comment_right: -substractValue },
    }
  );
};
export {
  createCommentService,
  getCommentsByProductService,
  updateCommentService,
  deleteCommentService,
};
