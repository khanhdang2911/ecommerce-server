import express from "express";
import * as checkoutController from "../../controllers/checkout.controller";
import asyncHandler from "../../helpers/asyncHandler";
import auth from "../../middlewares/auth.middleware";
const checkoutRouter = express.Router();

checkoutRouter.use(asyncHandler(auth));
checkoutRouter.post(
  "/checkout-review",
  asyncHandler(checkoutController.checkoutReview)
);

export default checkoutRouter;
