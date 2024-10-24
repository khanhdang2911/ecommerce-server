import { Request, Response, NextFunction } from "express";
import HEADER from "../constants/header";
import ErrorResponse from "../core/error.response";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { findByUserId } from "../services/keyToken.service";
import JWT from "jsonwebtoken";
import mongoose from "mongoose";
import { findShopById } from "../services/shop.service";
const authV2 = async (req: Request, res: Response, next: NextFunction) => {
  //check UserId in header
  const userId = req.headers[HEADER.userId]?.toString();
  if (!userId) {
    throw new ErrorResponse(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);
  }
  //check keyToken
  const keyToken = await findByUserId(new mongoose.Types.ObjectId(userId));
  if (!keyToken) {
    throw new ErrorResponse(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);
  }
  //check Refresh Token
  const refreshToken = req.headers[HEADER.refreshToken]?.toString();
  if (!refreshToken) {
    throw new ErrorResponse(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);
  }
  //check access token
  const accessToken = req.headers[HEADER.authorization]?.toString();
  if (!accessToken) {
    throw new ErrorResponse(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);
  }
  const decoded = JWT.verify(accessToken, keyToken.publicKey, {
    ignoreExpiration: true,
  });

  if ((decoded as JWT.JwtPayload).userId != userId) {
    throw new ErrorResponse(StatusCodes.FORBIDDEN, ReasonPhrases.FORBIDDEN);
  }
  const shop = await findShopById(userId);
  if (!shop) {
    throw new ErrorResponse(
      StatusCodes.FORBIDDEN,
      "Invalid Token, Shop not found"
    );
  }
  req.shop = shop;
  req.keyToken = keyToken;
  req.refreshToken = refreshToken;
  next();
};

export default authV2;
