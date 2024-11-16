import { IOrder, Order } from "../models/order.model";

const findOrderById = async (orderId: string) => {
  return await Order.findById(orderId);
};

const createOrder = async (order: IOrder) => {
  return await Order.create(order);
};

const updateOneOrder = async (filter: object, update: object) => {
  const options = { new: true };
  return await Order.findOneAndUpdate(filter, update, options);
};

const findOrderByFilter = async (filter: object) => {
  return await Order.find(filter).lean().exec();
};
export { createOrder, findOrderById, updateOneOrder, findOrderByFilter };
