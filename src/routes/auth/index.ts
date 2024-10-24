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

authRouter.post("/signUp", asyncHandler(signUp));
authRouter.post(
  "/createApiKey",
  asyncHandler(auth),
  asyncHandler(createApiKey)
);

authRouter.post("/logout", asyncHandler(auth), asyncHandler(logout));
authRouter.post("/login", asyncHandler(login));
authRouter.post(
  "/refreshToken",
  asyncHandler(authV2),
  asyncHandler(refreshToken)
);
export default authRouter;
