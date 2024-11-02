import { StatusCodes } from "http-status-codes";
import ErrorResponse from "../core/error.response";
import { Cart } from "../models/cart.model";
import { CART_ERROR_MESSASE } from "../constants/cart.constant";

const findUserCart = async (userId: any) => {
  const userCart = await Cart.findOne({
    cart_user: userId,
  });
  if (!userCart) {
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      CART_ERROR_MESSASE.CART_NOT_FOUND
    );
  }
  return userCart;
};

export { findUserCart };
