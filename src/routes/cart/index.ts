import express from "express";
import * as cartController from "../../controllers/cart.controller";
import asyncHandler from "../../helpers/asyncHandler";
import auth from "../../middlewares/auth.middleware";
const cartRouter = express.Router();

//===================================No Authentications===================================//

//===================================Authentications===================================//
cartRouter.use(asyncHandler(auth));

cartRouter.post(
  "/add-product-to-cart",
  asyncHandler(cartController.addProductToCart)
);
cartRouter.put("/update-cart", asyncHandler(cartController.updateCart));
cartRouter.delete(
  "/delete-product-in-cart/:product_id",
  asyncHandler(cartController.deleteProductInCart)
);
cartRouter.get("/get-list-product-in-cart/", asyncHandler(cartController.getListProductInCart))
export default cartRouter;
