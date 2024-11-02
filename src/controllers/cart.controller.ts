import { Request, Response } from "express";
import * as cartService from "../services/cart.service";
import SuccessResponse from "../core/success.response";
import { StatusCodes } from "http-status-codes";
const addProductToCart = async (req: Request, res: Response) => {
  const userId = req.shop?._id;
  const product = req.body;
  const cart = await cartService.addProductToCartService(userId, product);
  new SuccessResponse(
    StatusCodes.OK,
    "Product added to cart successfully",
    cart
  ).send(res);
};

//update quantity for many products
const updateCart = async (req: Request, res: Response) => {
  const userId = req.shop?._id;
  const product = req.body;
  const updatedCart = await cartService.updateCartService(userId, product);
  new SuccessResponse(
    StatusCodes.OK,
    "Cart updated successfully",
    updatedCart
  ).send(res);
};

const deleteProductInCart = async (req: Request, res: Response) => {
  const userId = req.shop?._id;
  const product_id = req.params.product_id;
  const updatedCart = await cartService.deleteProductInCartService(
    userId,
    product_id
  );
  new SuccessResponse(
    StatusCodes.OK,
    "Delete product in cart successfully!",
    updatedCart!
  ).send(res);
};

const getListProductInCart = async (req: Request, res: Response) => {
  const userId = req.shop?._id;
  const results = await cartService.getListProductInCartService(userId);
  new SuccessResponse(
    StatusCodes.OK,
    "Get list product in cart successfully!",
    results
  ).send(res);
};
export {
  addProductToCart,
  updateCart,
  deleteProductInCart,
  getListProductInCart,
};
