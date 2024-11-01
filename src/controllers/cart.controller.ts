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
  const body = req.body;
  const updateCart = await cartService.updateCartService(userId, body);
  new SuccessResponse(
    StatusCodes.OK,
    "Cart updated successfully",
    updateCart
  ).send(res);
};
export { addProductToCart, updateCart };
