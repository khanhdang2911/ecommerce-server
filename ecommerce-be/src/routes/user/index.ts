import express from "express";
import asyncHandler from "../../helpers/asyncHandler";
import auth from "../../middlewares/auth.middleware";
import * as userController from "../../controllers/user.controller";
import checkPermission from "../../middlewares/checkPermission.middleware";
const userRouter = express.Router();

//===================================Authentications===================================//
userRouter.use(asyncHandler(auth));
//get user info
userRouter.get(
  "/user",
  checkPermission("user", "readOwn"),
  asyncHandler(userController.getUserInfo)
);
//get all user => admin
userRouter.get(
  "/users",
  checkPermission("user", "readAny"),
  asyncHandler(userController.getAllUsers)
);

export default userRouter;
