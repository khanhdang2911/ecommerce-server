import express from "express";
import { createProduct } from "../../controllers/product.controller";
import asyncHandler from "../../helpers/asyncHandler";
import auth from "../../middlewares/auth.middleware";
const productRouter = express.Router();

productRouter.post(
  "/createProduct",
  asyncHandler(auth),
  asyncHandler(createProduct)
);

export default productRouter;
