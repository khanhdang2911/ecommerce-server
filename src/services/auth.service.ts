import mongoose, { Schema } from "mongoose";
import { Shop } from "../models/shop.model";
import bcrypt from "bcrypt";
import * as crypto from "crypto";
import { createPairToken } from "../auth/authUtils";
import { getInfoData } from "../utils";
import * as KeyTokenService from "./keyToken.service";
import ErrorResponse from "../core/error.response";
import { StatusCodes } from "http-status-codes";
import { findShopByEmail, findShopById } from "./shop.service";
import JWT from "jsonwebtoken";
enum RoleShop {
  ADMIN = "admin",
  WRITER = "writer",
  EDITOR = "editor",
  SHOP = "shop",
}

const createShopService = async (
  name: string,
  email: string,
  password: string
) => {
  const holderShop = await Shop.findOne({ email });
  if (holderShop) {
    throw new ErrorResponse(StatusCodes.CONFLICT, "Email is already taken");
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const newShop = await Shop.create({
    name,
    email,
    password: passwordHash,
    roles: [RoleShop.SHOP],
  });
  //generate token
  const privateKey = crypto.randomBytes(64).toString("hex");
  const publicKey = crypto.randomBytes(64).toString("hex");
  const tokens = createPairToken(
    { userId: newShop._id, email: newShop.email },
    privateKey,
    publicKey
  );
  //save token
  await KeyTokenService.createKeyToken(
    newShop._id as any,
    privateKey,
    publicKey,
    tokens.refreshToken
  );
  const data = {
    shop: getInfoData({
      field: ["_id", "name", "email", "roles"],
      data: newShop,
    }),
    tokens: tokens,
  };
  return data;
};

const loginService = async (email: string, password: string) => {
  const shop = await findShopByEmail(email);
  if (!shop) {
    throw new ErrorResponse(StatusCodes.NOT_FOUND, "Authentication failed");
  }
  const matchPassword = bcrypt.compare(password, shop.password);
  if (!matchPassword) {
    throw new ErrorResponse(StatusCodes.UNAUTHORIZED, "Authentication failed");
  }
  const privateKey = crypto.randomBytes(64).toString("hex");
  const publicKey = crypto.randomBytes(64).toString("hex");
  const tokens = createPairToken(
    { userId: shop._id, email: shop.email },
    privateKey,
    publicKey
  );
  //save token
  await KeyTokenService.createKeyToken(
    shop._id as any as Schema.Types.ObjectId,
    privateKey,
    publicKey,
    tokens.refreshToken
  );
  const data = {
    shop: getInfoData({
      field: ["_id", "name", "email", "roles"],
      data: shop,
    }),
    tokens: tokens,
  };
  return data;
};

const refreshTokenService = async (refreshToken: string, shop: any) => {
  if (!refreshToken) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Invalid request");
  }
  const foundToken = await KeyTokenService.findTokenByRefreshTokenUsed(
    refreshToken
  );
  if (foundToken) {
    const decodedToken = JWT.verify(refreshToken, foundToken.privateKey);
    const { userId, email } = decodedToken as JWT.JwtPayload;

    await KeyTokenService.removeTokenByUserId(
      new mongoose.Types.ObjectId(userId as string)
    );
    throw new ErrorResponse(
      StatusCodes.FORBIDDEN,
      "Something went wrong, please login again!"
    );
  }
  //not found token used => new refresh token

  //check xem phai token cua shop khong
  const holderToken = await KeyTokenService.findTokenByRefreshToken(
    refreshToken
  );
  if (!holderToken) {
    throw new ErrorResponse(StatusCodes.UNAUTHORIZED, "Shop not registered 1");
  }
  const decodedToken = JWT.verify(refreshToken, holderToken.privateKey);
  const { userId, email } = decodedToken as JWT.JwtPayload;
  const foundShop = await findShopById(userId);
  if (!foundShop) {
    throw new ErrorResponse(StatusCodes.UNAUTHORIZED, "Shop not registered 2");
  }
  //check shop in request is the same as shop in token
  if (shop._id.toString() != userId) {
    throw new ErrorResponse(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }
  //generate new token
  const tokens = createPairToken(
    { userId, email },
    holderToken.privateKey,
    holderToken.publicKey
  );
  //save token
  await holderToken.updateOne({
    $set: {
      refreshToken: tokens.refreshToken,
    },
    $addToSet: {
      refreshTokenUsed: refreshToken,
    },
  });
  return {
    shop: getInfoData({
      field: ["_id", "name", "email", "roles"],
      data: foundShop,
    }),
    tokens: tokens,
  };
};
export { createShopService, loginService, refreshTokenService };
