import express from "express";
import authRouter from "./auth";
import productRouter from "./product";
import { checkApiKey, permission } from "../middlewares/checkApiKey.middleware";
import asyncHandler from "../helpers/asyncHandler";
const router = express.Router();
//check api key
router.use(asyncHandler(checkApiKey));
//check permission
router.use(permission("0000"));

router.use("/v1/api/auth", authRouter);
router.use("/v1/api/product", productRouter);

export default router;
