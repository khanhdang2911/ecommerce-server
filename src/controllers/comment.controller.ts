import { Request, Response } from "express";
import {
  createCommentService,
  getCommentsByProductService,
  getCommentsService,
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
export { createComment, getCommentsByProduct };
