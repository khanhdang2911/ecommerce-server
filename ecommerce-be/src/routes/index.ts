import express from "express";
import authRouter from "./auth";
import productRouter from "./product";
import discountRouter from "./discount";
import cartRouter from "./cart";
import checkoutRouter from "./checkout";
import commentRouter from "./comment/index";
import userRouter from "./user";
import rbacRouter from "./rbac";

// import { checkApiKey, permission } from "../middlewares/checkApiKey.middleware";
const router = express.Router();
//check api key
// router.use(asyncHandler(checkApiKey));
//check permission
// router.use(permission("0000"));

router.use("/v1/api/auth", authRouter);
router.use("/v1/api/product", productRouter);
router.use("/v1/api/discount", discountRouter);
router.use("/v1/api/cart", cartRouter);
router.use("/v1/api/checkout", checkoutRouter);
router.use("/v1/api/comment", commentRouter);
router.use("/v1/api/user", userRouter);
router.use("/v1/api/rbac", rbacRouter);
export default router;
