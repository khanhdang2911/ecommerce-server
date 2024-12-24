import { Shop } from "../models/shop.model";

const getAllUsersService = async () => {
  return await Shop.find();
};

export { getAllUsersService };
