import { Shop } from "../models/shop.model";
const findShopByEmail = async (email: string) => {
  const shop = await Shop.findOne({ email }).lean();
  return shop;
};

const findShopById = async(id: string)=>{
  const shop = await Shop.findById(id).lean();
  return shop;
}
export { findShopByEmail, findShopById };
