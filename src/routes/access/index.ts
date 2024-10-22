import express from "express";
import { login, signUp, logout } from "../../controllers/auth.controller";
import { createApiKey } from "../../controllers/apiKey.controller";
import asyncHandler from "../../helpers/asyncHandler";
import authentication from "../../middlewares/authentication.middleware";
const accessRouter = express.Router();

accessRouter.post("/access/signUp", asyncHandler(signUp));
accessRouter.post("/access/createApiKey", asyncHandler(createApiKey));

accessRouter.post(
  "/access/logout",
  asyncHandler(authentication),
  asyncHandler(logout)
);
accessRouter.post("/access/login", asyncHandler(login));
export default accessRouter;
