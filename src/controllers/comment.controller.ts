import { Request, Response } from "express";
import {
  createCommentService,
  deleteCommentService,
  getCommentsByProductService,
  updateCommentService,
} from "../services/comment.service";
import SuccessResponse from "../core/success.response";
import { StatusCodes } from "http-status-codes";

const createComment = async (req: Request, res: Response) => {
  const userId = req.shop?._id;
  const commentData = req.body;
  const result = await createCommentService(userId, commentData);
  new SuccessResponse(
    StatusCodes.CREATED,
    "Comment created successfully",
    result
  ).send(res);
};

const getCommentsByProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  const results = await getCommentsByProductService(productId);
  new SuccessResponse(
    StatusCodes.OK,
    "Get comments successfully",
    results
  ).send(res);
};

const updateComment = async (req: Request, res: Response) => {
  const userId = req.shop?._id;
  const commentId = req.params.commentId;
  const commentData = req.body;
  const result = await updateCommentService(userId, commentId, commentData);
  new SuccessResponse(
    StatusCodes.OK,
    "Comment updated successfully",
    result
  ).send(res);
};

const deleteComment = async (req: Request, res: Response) => {
  const userId = req.shop?._id;
  const commentId = req.params.commentId;
  await deleteCommentService(userId, commentId);
  new SuccessResponse(StatusCodes.OK, "Comment deleted successfully").send(res);
};
export { createComment, getCommentsByProduct, updateComment, deleteComment };
