import express from "express";
import {
  login,
  signUp,
  logout,
  refreshToken,
} from "../../controllers/auth.controller";
import { createApiKey } from "../../controllers/apiKey.controller";
import asyncHandler from "../../helpers/asyncHandler";
import auth from "../../middlewares/auth.middleware";
import authV2 from "../../middlewares/authV2.middleware";
const authRouter = express.Router();

//======================================No Authentication==========================
authRouter.post("/signUp", asyncHandler(signUp));
authRouter.post("/login", asyncHandler(login));
authRouter.post(
  "/refreshToken",
  asyncHandler(authV2),
  asyncHandler(refreshToken)
);
//=======================================Authentication=============================
authRouter.use(asyncHandler(auth));
authRouter.post("/createApiKey", asyncHandler(createApiKey));
authRouter.post("/logout", asyncHandler(logout));
export default authRouter;
