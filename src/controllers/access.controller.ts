import { Request, Response } from "express";
import * as AccessService from "../services/access.service";
import ErrorResponse from "../core/error.response";
import { StatusCodes } from "http-status-codes";

const signUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Missing required fields");
  }
  const newShop = await AccessService.createShopService(name, email, password);
  res.status(201).json(newShop);
  return;
};

export { signUp };
