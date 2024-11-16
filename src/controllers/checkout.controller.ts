import { StatusCodes } from "http-status-codes";
import SuccessResponse from "../core/success.response";
import * as checkoutService from "../services/checkout.service";
import { Request, Response } from "express";

const checkoutReview = async (req: Request, res: Response) => {
  const userId = req.shop?._id;
  const checkoutInfo = req.body;
  const result = await checkoutService.checkoutReviewService(
    userId,
    checkoutInfo
  );
  new SuccessResponse(
    StatusCodes.OK,
    "Get checkout review successfully",
    result
  ).send(res);
};

const orderProducts = async (req: Request, res: Response) => {
  const userId = req.shop?._id;
  const orderInfo = req.body;
  const result = await checkoutService.orderProductsService(userId, orderInfo);
  new SuccessResponse(
    StatusCodes.OK,
    "Order products successfully",
    result
  ).send(res);
};
const cancelOrder = async (req: Request, res: Response) => {
  const userId = req.shop?._id;
  const orderId = req.params.orderId;
  const canceledOrder = await checkoutService.cancelOrderSerivce(
    userId,
    orderId
  );
  new SuccessResponse(
    StatusCodes.OK,
    "Cancel order successfully",
    canceledOrder
  ).send(res);
};

const getOrderForUser = async (req: Request, res: Response) => {
  const userId = req.shop?._id;
  const orderId = req.params.orderId;
  const order = await checkoutService.getOrderForUserService(userId, orderId);
  new SuccessResponse(
    StatusCodes.OK,
    "Get order successfully",
    order
  ).send(res);
}
const getAllOrdersForUser = async (req: Request, res: Response) => {
  const userId = req.shop?._id;
  const orders = await checkoutService.getAllOrdersForUserService(userId);
  new SuccessResponse(StatusCodes.OK, "Get all orders successfully", orders).send(res);
}

const updateOrderStatus = async (req: Request, res: Response) => {
  const orderId = req.params.orderId;
  const role = req.shop?.role;
  const updatedOrder = await checkoutService.updateOrderStatusService(orderId, req.body, role);
  new SuccessResponse(StatusCodes.OK, "Update order status successfully", updatedOrder).send(res);
}
export {
  checkoutReview,
  orderProducts,
  cancelOrder,
  getOrderForUser,
  getAllOrdersForUser,
  updateOrderStatus,
};
