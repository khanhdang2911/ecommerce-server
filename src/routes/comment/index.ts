import express from "express";
import * as commentController from "../../controllers/comment.controller";
import asyncHandler from "../../helpers/asyncHandler";
import auth from "../../middlewares/auth.middleware";
const commentRouter = express.Router();

//===================================No Authentications===================================//
commentRouter.get("/get-comments-by-product/:productId", asyncHandler(commentController.getCommentsByProduct));
//===================================Authentications===================================//
commentRouter.use(asyncHandler(auth));
commentRouter.post(
  "/create-comment",
  asyncHandler(commentController.createComment)
);
export default commentRouter;
