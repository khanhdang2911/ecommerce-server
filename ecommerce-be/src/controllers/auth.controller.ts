import { NextFunction, Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import * as keyTokenService from "../services/keyToken.service";
import ErrorResponse from "../core/error.response";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import SuccessResponse from "../core/success.response";
import mongoose from "mongoose";

// declare global {
//   namespace Express {
//     interface Request {
//       keyToken?: any;
//       objKey?: any;
//     }
//   }
// }

const signUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Missing required fields");
  }
  const newShop = await AuthService.createShopService(name, email, password);
  //return response
  new SuccessResponse(StatusCodes.CREATED, ReasonPhrases.CREATED, newShop).send(
    res
  );
  return;
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ErrorResponse(
      StatusCodes.BAD_REQUEST,
      "Invalid email or password"
    );
  }
  const responseData = await AuthService.loginService(email, password);
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK, responseData).send(res);
};

const logout = async (req: any, res: Response, next: NextFunction) => {
  const { keyToken } = req;
  const userId = new mongoose.Types.ObjectId(keyToken._id as string);
  const delKey = await keyTokenService.removeTokenById(userId);
  if (!delKey) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Logout failed");
  }
  new SuccessResponse(StatusCodes.OK, "Logout successfully!").send(res);
};

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.refreshToken;
  const shop = req.shop;
  const dataResponse = await AuthService.refreshTokenService(
    refreshToken as string,
    shop
  );
  new SuccessResponse(StatusCodes.OK, ReasonPhrases.OK, dataResponse).send(res);
};
export { signUp, login, logout, refreshToken };
