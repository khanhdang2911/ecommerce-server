import { Discount as DiscountMongo } from "../models/discount.model";
const findOne = async (filter: Object) => {
  return await DiscountMongo.findOne(filter);
};

const findByFilter = async (
  filter: Object,
  limit?: number,
  page?: number,
  select?: Array<string>
) => {
  const skip = limit! * (page! - 1);
  return await DiscountMongo.find(filter)
    .skip(skip)
    .limit(limit!)
    .select(select!)
    .lean()
    .exec();
};

export { findOne, findByFilter };
