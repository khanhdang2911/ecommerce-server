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
discountRouter.get(
  "/get-all-product-by-discount/:discountId",
  asyncHandler(discountController.getAllProductByDiscount)
);
discountRouter.get(
  "/get-all-discounts-of-shop/:shopId",
  asyncHandler(discountController.getAllDiscountsOfShop)
);

//=========================Authentications=========================
discountRouter.use(asyncHandler(auth));

discountRouter.put(
  "/verify-discount-code",
  asyncHandler(discountController.verifyDiscountCode)
); //User auth
discountRouter.put(
  "/cancel-discount/",
  asyncHandler(discountController.cancelDiscount)
); //User auth

discountRouter.post(
  "/create-discount",
  asyncHandler(discountController.createDiscount)
); //Shop or admin
discountRouter.patch(
  "/update-discount/:discountId",
  asyncHandler(discountController.updateDiscount)
); //Shop or admin
discountRouter.delete(
  "/delete-discount/:discountId",
  asyncHandler(discountController.deleteDiscount)
); //Shop or admin
export default discountRouter;
