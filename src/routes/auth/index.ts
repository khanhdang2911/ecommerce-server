import express from "express";
import { login, signUp, logout,refreshToken } from "../../controllers/auth.controller";
import { createApiKey } from "../../controllers/apiKey.controller";
import asyncHandler from "../../helpers/asyncHandler";
import auth from '../../middlewares/auth.middleware';
import refreshTokenAuth from "../../middlewares/refreshTokenAuth.middleware";
const authRouter = express.Router();

authRouter.post("/auth/signUp", asyncHandler(signUp));
authRouter.post("/auth/createApiKey",asyncHandler(auth), asyncHandler(createApiKey));

authRouter.post(
  "/auth/logout",
  asyncHandler(auth),
  asyncHandler(logout)
);
authRouter.post("/auth/login", asyncHandler(login));
//refresh token
authRouter.post("/auth/refreshToken",asyncHandler(refreshTokenAuth), asyncHandler(refreshToken))
export default authRouter;
