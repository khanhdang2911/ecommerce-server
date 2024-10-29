import express from "express";
import asyncHandler from "../../helpers/asyncHandler";
import * as discountController from "../../controllers/discount.controller";
import auth from "../../middlewares/auth.middleware";
const discountRouter = express.Router();

//=========================No Authentication=======================
discountRouter.get(
  "/get-discounts-by-product/:productId",
  asyncHandler(discountController.getDiscountsByProduct)
);

//=========================Authentications=======================
discountRouter.use(asyncHandler(auth));
discountRouter.post(
  "/create-discount",
  asyncHandler(discountController.createDiscount)
);
discountRouter.patch(
  "/update-discount/:discountId",
  asyncHandler(discountController.updateDiscount)
);
export default discountRouter;
