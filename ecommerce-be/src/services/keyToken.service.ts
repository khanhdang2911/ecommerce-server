import mongoose, { Schema } from "mongoose";
import { KeyToken } from "../models/keyToken.model";
const createKeyToken = async (
  user: Schema.Types.ObjectId,
  privateKey: string,
  publicKey: string,
  refreshToken: string
) => {
  const update = { user, privateKey, publicKey, refreshToken };
  const filter = { user };
  const newKeyToken = await KeyToken.findOneAndUpdate(filter, update, {
    new: true,
    upsert: true,
  });
  return newKeyToken;
};

const findByUserId = async (userId: mongoose.Types.ObjectId) => {
  const keyToken = await KeyToken.findOne({ user: userId }).lean();
  return keyToken;
};
const removeTokenByUserId = async (userId: mongoose.Types.ObjectId) => {
  await KeyToken.deleteOne({ user: userId });
};
const removeTokenById = async (id: mongoose.Types.ObjectId) => {
  const delKey = await KeyToken.findByIdAndDelete(id);
  return delKey;
};

const findTokenByRefreshTokenUsed = async (refreshToken: string) => {
  const keyToken = await KeyToken.findOne({
    refreshTokenUsed: refreshToken,
  }).lean();
  return keyToken;
};

const findTokenByRefreshToken = async (refreshToken: string) => {
  const keyToken = await KeyToken.findOne({ refreshToken });
  return keyToken;
};
export {
  createKeyToken,
  findByUserId,
  removeTokenById,
  findTokenByRefreshTokenUsed,
  removeTokenByUserId,
  findTokenByRefreshToken,
};
