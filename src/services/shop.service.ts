import { Shop } from "../models/shop.model";
const findShopByEmail = async (email: string) => {
  const shop = await Shop.findOne({ email }).lean();
  return shop;
};

export { findShopByEmail };
