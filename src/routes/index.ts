import express from "express";
import accessRouter from "./access";
import { checkApiKey, permission } from "../middlewares/checkApiKey.middleware";
import asyncHandler from "../helpers/asyncHandler";
const router = express.Router();
//check api key
router.use(asyncHandler(checkApiKey));
//check permission
router.use(permission("0000"));

router.use("/v1/api", accessRouter);

export default router;
