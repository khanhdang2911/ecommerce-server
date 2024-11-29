import { Schema } from "mongoose";
import { Discount as DiscountMongo } from "../models/discount.model";
import { unSelectData } from "../utils";
const findOne = async (filter: Object) => {
  return await DiscountMongo.findOne(filter);
};

const findByFilter = async (
  filter: object,
  select?: Array<string>,
  limit: number = 10,
  page: number = 1,
  sort: string = "ctime"
) => {
  const skip = limit! * (page! - 1);
  const sortBy: { [key: string]: 1 | -1 } =
    sort === "ctime" ? { updatedAt: -1 } : { updatedAt: 1 };
  return await DiscountMongo.find(filter)
    .skip(skip)
    .limit(limit!)
    .select(select!)
    .sort(sortBy)
    .lean()
    .exec();
};

const findByFilterUnSelect = async (
  filter: object,
  unSelect?: Array<string>,
  limit: number = 10,
  page: number = 1,
  sort: string = "ctime"
) => {
  const skip = limit! * (page! - 1);
  const sortBy: { [key: string]: 1 | -1 } =
    sort === "ctime" ? { updatedAt: -1 } : { updatedAt: 1 };
  return await DiscountMongo.find(filter)
    .skip(skip)
    .limit(limit!)
    .select(unSelectData(unSelect!))
    .sort(sortBy)
    .lean()
    .exec();
};

const findOneAndUpdate = async (
  filter: object,
  update: object,
  isNew: boolean
) => {
  return await DiscountMongo.findOneAndUpdate(filter, update, { new: isNew });
};
const deleteOne = async (filter: object) => {
  return await DiscountMongo.deleteOne(filter);
};

const findByIdAndUpdate = async (id: Schema.Types.ObjectId, update: object) => {
  return await DiscountMongo.findByIdAndUpdate(id, update);
};
export {
  findOne,
  findByFilter,
  findByFilterUnSelect,
  deleteOne,
  findOneAndUpdate,
  findByIdAndUpdate,
};
