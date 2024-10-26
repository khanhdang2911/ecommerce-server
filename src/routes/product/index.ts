import express from "express";
import {
  createProduct,
  findAllDraft,
  findAllPublished,
  publishProduct,
  unPublishProduct,
  searchProduct,
  findProductDetail,
} from "../../controllers/product.controller";
import asyncHandler from "../../helpers/asyncHandler";
import auth from "../../middlewares/auth.middleware";
const productRouter = express.Router();

//===================================No Authentications===================================//
productRouter.post("/search-product", asyncHandler(searchProduct));
productRouter.get("/find-product-detail/:id", asyncHandler(findProductDetail));

//===================================Authentications===================================//
productRouter.use(asyncHandler(auth));
//for shop
productRouter.post("/create-product", asyncHandler(createProduct));
productRouter.get("/find-all-draft", asyncHandler(findAllDraft));
productRouter.get("/find-all-published", asyncHandler(findAllPublished));
productRouter.put("/publish-product/:id", asyncHandler(publishProduct));
productRouter.put("/unpublish-product/:id", asyncHandler(unPublishProduct));
export default productRouter;
