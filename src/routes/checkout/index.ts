import express from "express";
import * as checkoutController from "../../controllers/checkout.controller";
import asyncHandler from "../../helpers/asyncHandler";
import auth from "../../middlewares/auth.middleware";
import checkPermission from "../../middlewares/checkPermission.middleware";
import { ROLE } from "../../constants/common.constant";
const checkoutRouter = express.Router();

checkoutRouter.use(asyncHandler(auth));
checkoutRouter.post(
  "/checkout-review",
  asyncHandler(checkoutController.checkoutReview)
);
checkoutRouter.post(
  "/order-products",
  asyncHandler(checkoutController.orderProducts)
);
checkoutRouter.put(
  "/cancel-order/:orderId",
  asyncHandler(checkoutController.cancelOrder)
);
checkoutRouter.get(
  "/get-all-orders-for-user",
  asyncHandler(checkoutController.getAllOrdersForUser)
);
checkoutRouter.get(
  "/get-order-for-user/:orderId",
  asyncHandler(checkoutController.getOrderForUser)
);
checkoutRouter.put(
  "/update-order-status/:orderId",
  checkPermission([ROLE.ADMIN, ROLE.SHOP]),
  asyncHandler(checkoutController.updateOrderStatus)
);
export default checkoutRouter;
