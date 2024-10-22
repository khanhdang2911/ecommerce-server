import { Request, Response, NextFunction } from "express";
import HEADER from "../constants/header";
import ErrorResponse from "../core/error.response";
import { StatusCodes } from "http-status-codes";
import { findByUserId } from "../services/keyToken.service";
import JWT from "jsonwebtoken";
import mongoose from "mongoose";
const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //check UserId in header
  const userId = req.headers[HEADER.userId]?.toString();
  if (!userId) {
    throw new ErrorResponse(StatusCodes.FORBIDDEN, "Invalid Request");
  }
  //check keyToken
  const keyToken = await findByUserId(new mongoose.Types.ObjectId(userId));
  if (!keyToken) {
    throw new ErrorResponse(StatusCodes.FORBIDDEN, "Invalid Request");
  }
  //check access token
  const accessToken = req.headers[HEADER.authorization]?.toString();
  if (!accessToken) {
    throw new ErrorResponse(StatusCodes.FORBIDDEN, "Invalid Token");
  }
  const decoded = JWT.verify(accessToken, keyToken.publicKey);

  if ((decoded as JWT.JwtPayload).userId != userId) {
    throw new ErrorResponse(StatusCodes.FORBIDDEN, "Invalid Token");
  }
  req.keyToken = keyToken;
  next();
};

export default authentication;
