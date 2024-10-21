import { Schema } from "mongoose";
import { KeyToken } from "../models/keyToken.model";
const createKeyToken = async (
  user: Schema.Types.ObjectId,
  privateKey: string,
  publicKey: string,
  refreshToken: string
) => {
  const newKeyToken = await KeyToken.create({
    user,
    privateKey,
    publicKey,
    refreshToken,
  });
  return newKeyToken;
};

export { createKeyToken };
